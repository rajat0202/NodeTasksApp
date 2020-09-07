const mongoose = require("mongoose");
const becrypt = require("bcryptjs");
const validator = require("validator");
//const Task = require("./tasks.js");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    age: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.methods.generateJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, "thisistasks");
  console.log(token);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("no match found");
  }

  const isMatch = await becrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("invalid creds");
  }

  return user;
};
//Hash code
userSchema.pre("save", async function (next) {
  const user = this;
  console.log("from the pre methiod");

  if (user.isModified("password")) {
    user.password = await becrypt.hash(user.password, 8);
  }

  next();
});

// userSchema.pre("remove", async function (next) {
//   const user = this;
//   await taskModels.deleteMany({ owner: req.user._id });
//   console.log("from the pre remove methiod");

//   await next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
