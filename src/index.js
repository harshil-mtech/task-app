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
