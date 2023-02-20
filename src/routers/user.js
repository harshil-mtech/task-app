const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

// User creation endpoint
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const createdUser = await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ createdUser, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// User login endpoint
router.post("/users/login", async (req, res) => {
  try {
    console.log(req.body.email, req.body.password);
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

// User logout endpoint for current session
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// User logout endpoint for all session except current
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// User Reading endpoint
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// User updation endpoint
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid update" });

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

// User Deletion endpoint
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;
