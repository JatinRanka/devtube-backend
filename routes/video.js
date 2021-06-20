const express = require("express");
const { Video } = require("../models");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const videosList = await Video.find({}).sort('title').select("-description").populate({
      path: "postedBy",
      select: "name email image",
    });

    return res.json({
      success: true,
      videosList,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const video = req.body;
    const newVideo = new Video(video);
    const savedVideo = await newVideo.save();

    return res.status(201).json({
      success: true,
      message: "Video posted successfully",
      video: savedVideo,
    });
  } catch (error) {
    next(error);
  }
});

router.param("videoId", async (req, res, next, id) => {
  try {
    const video = await Video.findById(id).populate({
      path: "postedBy",
      select: "name email image",
    });

    if (!video) throw new Error("Video not found");

    req.video = video;
    next();
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.route("/:videoId").get((req, res) => {
  const { video } = req;
  res.json({ success: true, video });
});

module.exports = { router };
