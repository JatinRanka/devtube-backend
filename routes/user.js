const express = require("express");
const router = express.Router();
const { User } = require("../models");
const {
  createDefaultPlaylistsForUser,
  generateAuthToken,
} = require("../helper");

router.post("/", async (req, res, next) => {
  try {
    const user = req.body;
    const newUser = new User(user);
    const savedUser = await newUser.save();

    createDefaultPlaylistsForUser(savedUser);

    const token = generateAuthToken(savedUser);

    res
      .status(201)
      .header({
        Authorization: token,
        "access-control-expose-headers": "Authorization",
      })
      .json({
        success: true,
        message: "User created successfully.",
        user: savedUser,
      });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const token = generateAuthToken(user);

    res
      .header({
        Authorization: token,
        "access-control-expose-headers": "Authorization",
      })
      .json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

module.exports = { router };
