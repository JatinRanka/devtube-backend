const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const { DEFAULT_PLAYLISTS } = require("../constants");
const { Playlist } = require("../models");

const canDeletePlaylist = (playlist) =>
  !DEFAULT_PLAYLISTS.includes(playlist.category);

// converts "WATCH_LATER" to "watch later"
const getFormattedName = (name) => name.split("_").join(" ").toLowerCase();

const createDefaultPlaylistsForUser = async (user) => {
  try {
    for (let index = 0; index < DEFAULT_PLAYLISTS.length; index++) {
      const defaultPlaylist = DEFAULT_PLAYLISTS[index];

      const playlist = {
        name: getFormattedName(defaultPlaylist), // "WATCH_LATER" => "watch later"
        category: defaultPlaylist,
        user: user._id,
        listOfVideos: [],
      };

      const newPlaylist = Playlist(playlist);
      await newPlaylist.save();
    }
  } catch (error) {
    console.log(error);
  }
};

const generateAuthToken = (user) => {
  const payload = {
    userId: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY);
  return token;
};

module.exports = {
  canDeletePlaylist,
  createDefaultPlaylistsForUser,
  generateAuthToken,
};
