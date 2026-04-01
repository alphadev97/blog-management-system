import { useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchPosts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.search) params.append("search", filters.search);
      if (filters.my) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts/my?${params}`,
        );
        setPosts(response.data.posts);
        return response.data;
      } else {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts?${params}`,
        );
        setPosts(response.data.posts);
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch posts");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(
    async (postData) => {
      setLoading(true);
      setError(null);
      try {
        // Optimistic update
        const tempPost = { ...postData, id: "temp-" + Date.now() };
        setPosts((prev) => [tempPost, ...prev]);

        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/posts`,
          postData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Replace temp post with real one
        setPosts((prev) =>
          prev.map((p) => (p.id === tempPost.id ? response.data.post : p)),
        );

        return response.data.post;
      } catch (err) {
        // Revert optimistic update
        setPosts((prev) => prev.filter((p) => p.id !== "temp-" + Date.now()));
        setError(err.response?.data?.message || "Failed to create post");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const updatePost = useCallback(
    async (id, postData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/posts/${id}`,
          postData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setPosts((prev) =>
          prev.map((p) => (p._id === id ? response.data.post : p)),
        );

        return response.data.post;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update post");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const deletePost = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/posts/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setPosts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete post");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const toggleStatus = useCallback(
    async (id, status) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_API_BASE_URL}/posts/${id}/status`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setPosts((prev) =>
          prev.map((p) => (p._id === id ? response.data.post : p)),
        );

        return response.data.post;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update status");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    toggleStatus,
  };
};

export default usePosts;
