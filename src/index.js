const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.port || 3000;

// By default, it is undefined, and is populated when you use body-parsing middleware such as express.json() or express.urlencoded().
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

const Task = require("./models/task");
const User = require("./models/user");
const main = async () => {
  // const task = await Task.findById("63ef6d0eb07feb132f35e307");
  // await task.populate("owner");
  // console.log(task.owner);

  const user = await User.findById("63ef6d04b07feb132f35e301");
  await user.populate("tasks");
  console.log(user.tasks);
};

main();
