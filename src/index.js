const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.port || 3000;

// By default, it is undefined, and is populated when you use body-parsing middleware such as express.json() or express.urlencoded().
app.use(express.json());

// User creation endpoint
app.post("/users", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(400);
      res.send(err);
    });
});

// User Reading endpoint
app.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send();
    });
});

app.get("/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) return res.status(404).send();
      res.send(user);
    })
    .catch((e) => {
      if (e.name === "CastError") return res.status(404).send();
      res.status(500).send();
    });
});

// Task creation endpoint
app.post("/tasks", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then((task) => {
      res.status(201).send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Task Reading endpoint
app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

app.get("/tasks/:id", (req, res) => {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) return res.status(404).send();
      res.send(task);
    })
    .catch((e) => {
      if (e.name === "CastError") return res.status(404).send();
      res.status(500).send();
    });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
