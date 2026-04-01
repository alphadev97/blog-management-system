import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "../styles/CommentSection.css";

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch existing comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}/comments`,
        );
        setComments(response.data.comments || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load comments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setSubmitError("Comment cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}/comments`,
        { content: newComment },
      );

      // Optimistically update - add the new comment to the list
      const commentData = response.data.comment;
      setComments((prev) => [commentData, ...prev]);
      setNewComment("");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to post comment");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>

      {/* Comment Form - Only visible if user is logged in */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="form-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="comment-textarea"
              rows="4"
              disabled={submitting}
            />
          </div>
          {submitError && <div className="error-message">{submitError}</div>}
          <button
            type="submit"
            className="submit-button"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="login-prompt">
          <p>
            <Link to="/login">Please log in</Link> to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="loading-comments">Loading comments...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : comments.length === 0 ? (
        <div className="no-comments">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.author?.name}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
