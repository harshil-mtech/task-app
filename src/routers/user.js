const express = require("express");
const User = require("../models/user");
const router = new express.Router();

// User creation endpoint
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const createdUser = await user.save();
    res.status(201).send(createdUser);
  } catch (e) {
    res.status(400).send(e);
  }
});

// User Reading endpoint
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    !user ? res.status(404).send() : res.send(user);
  } catch (e) {
    e.name === "CastError" ? res.status(404).send() : res.status(500).send();
  }
});

// User updation endpoint
router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid update" });

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    !updatedUser ? res.status(404).send() : res.send(updatedUser);
  } catch (e) {
    e.name === "CastError" ? res.status(404).send() : res.status(500).send();
    res.status(400).send(e);
  }
});

// User Deletion endpoint
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    !user ? res.status(404).send() : res.send(user);
  } catch (e) {
    e.name === "CastError" ? res.status(404).send() : res.status(500).send();
  }
});

module.exports = router;
