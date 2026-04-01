import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import "../styles/PublicBlog.css";

const PublicBlog = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const { posts, loading, fetchPosts } = usePosts();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const result = await fetchPosts({ page, search, limit: 5 });
        setPagination(result.pagination);
      } catch (err) {
        console.error(err);
      }
    };
    loadPosts();
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="public-blog">
      <div className="container">
        <h1>Blog</h1>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {loading && <p>Loading posts...</p>}
        {posts.length === 0 && !loading && <p>No posts found.</p>}

        <div className="posts-grid">
          {posts.map((post) => (
            <Link
              key={post?._id}
              to={`/posts/${post?._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="post-card">
                <h2>{post?.title}</h2>
                <p className="author">By {post?.author?.name}</p>
                <p className="post-content">
                  {post?.content.substring(0, 150)}...
                </p>
                <div className="post-meta">
                  <span className="tags">{post?.tags?.join(", ")}</span>
                  <span className="date">
                    {new Date(post?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {pagination && (
          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrev}
              className="prev-btn"
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNext}
              className="next-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBlog;
