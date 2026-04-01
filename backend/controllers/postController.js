const Post = require("../models/Post");
const Joi = require("joi");

// Validation schema for post
const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  status: Joi.string().valid("draft", "published").default("draft"),
  tags: Joi.array().items(Joi.string()).default([]),
});

// GET all posts (public - published only with pagination)
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 5, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = { status: "published" };

    // Add search filter if provided
    if (search) {
      filter.$text = { $search: search };
    }

    const posts = await Post.find(filter)
      .populate("author", "name email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      posts,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET user's posts (admin sees all posts, authors see only their own)
const getMyPosts = async (req, res) => {
  try {
    const { page = 1, limit = 5, search } = req.query;
    const skip = (page - 1) * limit;

    // Admin sees all posts, author sees only their own
    let filter = req.user.role === "admin" ? {} : { author: req.user.id };

    // Add search filter if provided
    if (search) {
      filter.$text = { $search: search };
    }

    const posts = await Post.find(filter)
      .populate("author", "name email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      posts,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE post
const createPost = async (req, res) => {
  try {
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const post = new Post({
      ...value,
      author: req.user.id,
    });

    await post.save();
    await post.populate("author", "name email");

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(post, value);
    await post.save();
    await post.populate("author", "name email");

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single post by ID (public - published only)
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate("author", "name");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only show published posts to public (unless user is owner/admin for draft viewing)
    if (
      post.status !== "published" &&
      req.user?.id !== post.author._id &&
      req.user?.role !== "admin"
    ) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH post status (toggle draft/published)
const togglePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    post.status = status;
    await post.save();
    await post.populate("author", "name email");

    res.status(200).json({ message: "Post status updated", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePostStatus,
};
