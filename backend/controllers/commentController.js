const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Joi = require("joi");

// Validation schema
const commentSchema = Joi.object({
  content: Joi.string().required(),
});

// GET comments for a post
const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE comment
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { error, value } = commentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      ...value,
      author: req.user.id,
      post: postId,
    });

    await comment.save();
    await comment.populate("author", "name email");

    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPostComments, createComment };
