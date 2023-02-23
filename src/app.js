const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

// By default, it is undefined, and is populated when you use body-parsing middleware such as express.json() or express.urlencoded().
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
