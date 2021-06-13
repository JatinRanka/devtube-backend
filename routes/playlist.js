const express = require("express");
const { canDeletePlaylist } = require("../helper");
const router = express.Router();
const { Playlist } = require("../models");

const populate = {
  path: 'listOfVideos',
  model: 'Video',
  select: '_id title youtubeId postedBy',
  populate: [
    {
      path: 'postedBy',
      model: 'User',
      select: "_id name",
    }
  ]
}


router.get("/", async (req, res, next) => {
  try {
    const { user } = req;
    const playlists = await Playlist.find({ user: user._id }).populate(populate);

    return res.json({
      success: true,
      playlists,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { user } = req;
    const playlist = { ...req.body, user };
    const newPlaylist = new Playlist(playlist);
    const savedPlaylist = await newPlaylist.save();
    const populatedPlaylist = await Playlist.populate(savedPlaylist, populate);

    return res.status(201).json({
      success: true,
      message: "Playlist created successfully.",
      playlist: populatedPlaylist,
    });
  } catch (error) {
    next(error);
  }
});

router.param("playlistId", async (req, res, next, id) => {
  try {
    const playlist = await Playlist.findOne({ _id: id }).populate(populate);

    if (!playlist) throw new Error("Playlist not found");

    req.playlist = playlist;
    next();
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/:playlistId", async (req, res, next) => {
  const { playlist } = req;

  return res.json({
    success: true,
    playlist,
  });
});

router.post("/:playlistId", async (req, res, next) => {
  try {
    const { type, videoId } = req.body;
    const { playlist } = req;
    let update = {},
      message = "";

    switch (type) {
      case "ADD":
        update = { $push: { listOfVideos: videoId } };
        message = "Video added to playlist";
        break;

      case "REMOVE":
        update = { $pull: { listOfVideos: videoId } };
        message = "Video removed from playlist.";
        break;

      default:
        break;
    }

    const updatedPlaylist = await Playlist.findOneAndUpdate(
      { _id: playlist._id },
      update,
      { new: true }
    )
      .populate(populate);

    return res.status(201).json({
      success: true,
      message,
      playlist: updatedPlaylist,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:playlistId", async (req, res, next) => {
  try {
    const { playlist } = req;

    if (!canDeletePlaylist(playlist))
      throw new Error("Cannot delete default playlist.");

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlist._id);

    return res.json({
      success: true,
      message: `${deletedPlaylist.name} deleted successfully.`,
      playlist: deletedPlaylist,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { router };
