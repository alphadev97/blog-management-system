const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

// Index for text search
postSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Post", postSchema);
