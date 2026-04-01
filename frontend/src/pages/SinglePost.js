import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentSection from "../components/CommentSection";
import "../styles/SinglePost.css";

const SinglePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}`,
        );
        setPost(response.data.post);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load post");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="single-post-container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="single-post-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate("/")} className="back-button">
          Back to Blog
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="single-post-container">
        <div className="error-message">Post not found</div>
        <button onClick={() => navigate("/")} className="back-button">
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="single-post-container">
      <button onClick={() => navigate("/")} className="back-button">
        ← Back to Blog
      </button>
      <article className="single-post">
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="author">By {post.author?.name}</span>
            <span className="date">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="post-content">{post.content}</div>

        {post.updatedAt && post.updatedAt !== post.createdAt && (
          <footer className="post-footer">
            <small>
              Updated on{" "}
              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </small>
          </footer>
        )}
      </article>

      <CommentSection postId={post._id} />
    </div>
  );
};

export default SinglePost;
