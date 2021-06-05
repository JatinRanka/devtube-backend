const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    youtubeId: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", VideoSchema);
module.exports = { Video };
