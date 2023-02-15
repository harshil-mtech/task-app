const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.port || 3000;

// By default, it is undefined, and is populated when you use body-parsing middleware such as express.json() or express.urlencoded().
app.use(express.json());

// User creation endpoint
app.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const createdUser = await user.save();
    res.status(201).send(createdUser);
  } catch (e) {
    res.status(400).send(e);
  }
});

// User Reading endpoint
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    !user ? res.status(404).send() : res.send(user);
  } catch (e) {
    e.name === "CastError" ? res.status(404).send() : res.status(500).send();
  }
});

// Task creation endpoint
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    const createdTask = await task.save();
    res.status(201).send(createdTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Task Reading endpoint
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    !task ? res.status(404).send() : res.send(task);
  } catch (e) {
    e.name === "CastError" ? res.status(404).send() : res.status(500).send();
  }
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
