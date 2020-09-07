const express = require("express");
const multer = require("multer");
require("./Db/mongoose.js");

const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");
const User = require("./models/user.js");
const task = require("./models/tasks.js");

const app = express();

const port = process.env.port || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("server is up running");
});
