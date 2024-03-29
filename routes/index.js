const express = require("express");
const router = express.Router();

const { router: userRouter } = require("./user");
const { router: videoRouter } = require("./video");
const { router: playlistRouter } = require("./playlist");
const { isUserLoggedIn } = require("../middleware");

router.use("/users", userRouter);
router.use("/videos", videoRouter);
router.use("/playlists", isUserLoggedIn, playlistRouter);

router.get("/", (req, res) => {
  console.log("Server is up and running.");
  res.json({ success: true, message: "Server is up and running." });
});

module.exports = { router };
