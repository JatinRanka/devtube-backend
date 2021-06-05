const mongoose = require("mongoose");
const { DEFAULT_PLAYLISTS } = require("../constants");

const PlaylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listOfVideos: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Video",
      },
    ],
    category: {
      type: String,
      enum: [...DEFAULT_PLAYLISTS],
    },
  },
  {
    timestamps: true,
  }
);

const Playlist = mongoose.model("Playlist", PlaylistSchema);
module.exports = { Playlist };
