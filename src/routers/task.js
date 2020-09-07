const express = require("express");

const task = require("../models/tasks.js");
const User = require("../models/user.js");
const auth = require("../middleware/auth.js");

const router = new express.Router();

router.post("/task", auth, async (req, res) => {
  console.log(req.body);
  const tasks = new task({
    ...req.body,
    owner: req.user._id,
  });

  tasks
    .save()
    .then(() => {
      res.status(201).send(tasks);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});

router.get("/task", auth, async (req, res) => {
  try {
    var value = null;
    var tasks = null;
    var sort = {};

    if (req.query.sortby) {
      const part = req.query.sortby.split(":");

      sort[part[0]] = part[1] === "desc" ? -1 : 1;
    }

    if (req.query.completed) {
      value = req.query.completed === "true";
      var tasks = await task
        .find({ completed: value, owner: req.user._id })
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip))
        .sort(sort);
    } else {
      var tasks = await task
        .find({ owner: req.user._id })
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip))
        .sort(sort);
    }

    if (!tasks) {
      res.status(404).send();
    }
    res.send(tasks);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/task/:id", auth, async (req, res) => {
  const id = req.params.id;

  const tasks = await task.findOne({ _id: id, owner: req.user._id });

  try {
    if (!tasks) {
      res.status(404).send();
    }
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/task/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;

    console.log(req.body);
    const tasks = await task.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    console.log(tasks);
    if (!tasks) {
      return res.status(404).send();
    }

    res.send(tasks);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/task/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const Task = await task.findByIdAndDelete({ _id: id, owner: req.user._id });

    if (!Task) {
      return res.status(404).send();
    }
    res.send(Task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
