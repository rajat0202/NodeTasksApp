const express = require("express");
const multer = require("multer");
const User = require("../models/user.js");
const Task = require("../models/tasks.js");
const auth = require("../middleware/auth.js");

const router = new express.Router();

router.post("/Users", async (req, res) => {
  console.log(req.body);
  try {
    const user = await new User(req.body);
    const token = await user.generateJWT();

    await user.save();
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/Users/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateJWT();
    console.log(token);
    res.send({
      user,
      token,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/Users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post("/Users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get("/Users/me", auth, (req, res) => {
  res.send(req.user);
});

//route to find User by id not needed any more
// router.get("/Users/:id", (req, res) => {
//   const id = req.params.id;

//   User.findById(id)
//     .then((user) => {
//       if (!user) {
//         return res.status(404).send();
//       }
//       res.send(user);
//     })
//     .catch((error) => {
//       res.status(404).send();
//     });
// });

router.patch("/Users/me", auth, async (req, res) => {
  try {
    const update = Object.keys(req.body);

    update.forEach((update) => (req.user[update] = req.body[update]));
    await user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send();
  }
});

// router.delete("/Users/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.delete("/Users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    await Task.deleteMany({ owner: req.user._id });
    console.log("deleted");
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please upload an image"));
    }

    cb(undefined, true);
  },
});
router.post(
  "/Users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(500).send({ error: error.message });
  }
);

router.delete("/Users/avatar/deleteme", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

module.exports = router;
