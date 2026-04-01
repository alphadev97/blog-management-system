const express = require("express");
const {
  getAllPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePostStatus,
} = require("../controllers/postController");
const {
  getPostComments,
  createComment,
} = require("../controllers/commentController");
const { getPostStats } = require("../controllers/statsController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllPosts);

// Comments routes (public read, authenticated write)
router.get("/:postId/comments", getPostComments);
router.post("/:postId/comments", verifyToken, createComment);

// Stats route
router.get("/stats", getPostStats);

// Protected routes
router.get("/my", verifyToken, getMyPosts);
router.post("/", verifyToken, authorizeRoles("author", "admin"), createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.patch("/:id/status", verifyToken, togglePostStatus);

// Dynamic route - must be last to avoid intercepting specific routes
router.get("/:id", getPostById);

module.exports = router;
