const mongoose = require("mongoose");

const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
});

// const me = new User({
//   name: "Raandrewjat",
//   age: "26",
//   Email: "rajaggarwldeloittecom",
// });

// me.save()
//   .then((me) => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// const Task = mongoose.model("Task", {
//   description: {
//     type: String,
//   },
//   completed: {
//     type: Boolean,
//   },
// });

// const task = new Task({
//   description: "learn mongoose library",
//   completed: false,
// });

// task
//   .save()
//   .then((good) => {
//     console.log(good);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
