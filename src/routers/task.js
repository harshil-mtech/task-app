const express = require("express");
const Task = require("../models/task");

const router = new express.Router();

// Task creation endpoint
router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    const createdTask = await task.save();
    res.status(201).send(createdTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Task Reading endpoint
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    !task ? res.status(404).send() : res.send(task);
  } catch (e) {
    e.name === "CastError" ? res.status(404).send() : res.status(500).send();
  }
});

// Task Updation endpoint
router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid update request" });

  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    !updatedTask ? res.status(404).send() : res.send(updatedTask);
  } catch (e) {
    e.name === "CastError" ? res.status(404).send() : res.status(500).send();
  }
});

// Task Deletion endpoint
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndRemove(req.params.id);
    !task ? res.status(404).send() : res.send(task);
  } catch (e) {
    e.name === "CastError" ? res.status(404).send() : res.status(500).send();
  }
});

module.exports = router;
