import React, { useState, useEffect } from "react";
import usePosts from "../hooks/usePosts";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Dashboard.css";

const AuthorDashboard = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    toggleStatus,
  } = usePosts();
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts({ my: true, page });
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const postData = {
        title,
        content,
        status,
        tags: tags.split(",").map((t) => t.trim()),
      };

      if (editingId) {
        await updatePost(editingId, postData);
        setEditingId(null);
      } else {
        await createPost(postData);
      }

      setTitle("");
      setContent("");
      setTags("");
      setStatus("draft");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setTags(post.tags.join(", "));
    setStatus(post.status);
    setEditingId(post._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "draft" ? "published" : "draft";
      await toggleStatus(id, newStatus);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Welcome, {user?.name}!</h1>
        <p className="user-role">Role: {user?.role}</p>

        <div className="form-section">
          <h2>{editingId ? "Edit Post" : "Create New Post"}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="6"
              />
            </div>
            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="react, javascript, coding"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Post"
                  : "Create Post"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                  setTags("");
                  setStatus("draft");
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="posts-section">
          <h2>{user?.role === "admin" ? "All Posts" : "My Posts"}</h2>
          {loading && <p>Loading posts...</p>}
          {posts.length === 0 && !loading && (
            <p>
              {user?.role === "admin"
                ? "No posts in the system."
                : "No posts yet. Create your first post!"}
            </p>
          )}
          <div className="posts-list">
            {posts.map((post) => (
              <div key={post?._id} className="post-card">
                <h3>{post?.title}</h3>
                {post?.author && (
                  <p className="post-author">by {post?.author?.name}</p>
                )}
                <p className="post-content">
                  {post?.content.substring(0, 100)}...
                </p>
                <div className="post-meta">
                  <span className="status-badge">{post?.status}</span>
                  <span className="tags">{post?.tags?.join(", ")}</span>
                </div>
                <div className="post-actions">
                  <button onClick={() => handleEdit(post)}>Edit</button>
                  <button
                    onClick={() => handleDelete(post?._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleToggleStatus(post?._id, post?.status)}
                    className="toggle-btn"
                  >
                    {post?.status === "draft" ? "Publish" : "Unpublish"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;
