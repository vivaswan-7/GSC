import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaUsers, FaMapMarkerAlt, FaCommentAlt, FaTrash, FaTimes } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  // Load saved posts from localStorage or use default posts
  const getSavedPosts = () => {
    const savedPosts = localStorage.getItem("educonnect_posts");
    return savedPosts
      ? JSON.parse(savedPosts)
      : [
          {
            id: 1,
            title: "New Study Group: JavaScript Learners",
            content: "Join this group to master JavaScript together! 🚀",
            comments: [],
          },
          {
            id: 2,
            title: "Mentor Match Available: AI & ML",
            content: "Looking for an AI mentor? We found one for you! 🤖",
            comments: [],
          },
        ];
  };

  // State to manage posts
  const [posts, setPosts] = useState(getSavedPosts);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [commentInputs, setCommentInputs] = useState({});

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem("educonnect_posts", JSON.stringify(posts));
  }, [posts]);

  // Handle new post submission
  const handlePostSubmit = () => {
    if (!newPost.title || !newPost.content) return alert("Please fill in all fields.");
    const updatedPosts = [...posts, { id: posts.length + 1, ...newPost, comments: [] }];
    setPosts(updatedPosts);
    setNewPost({ title: "", content: "" });
  };

  // Handle post deletion
  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  // Handle comment input change
  const handleCommentChange = (postId, value) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };

  // Handle comment submission
  const handleCommentSubmit = (postId) => {
    if (!commentInputs[postId]) return alert("Please enter a comment.");
    
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: [...post.comments, { id: Date.now(), text: commentInputs[postId], timestamp: new Date() }],
          }
        : post
    );
    
    setPosts(updatedPosts);
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  // Handle comment deletion
  const handleDeleteComment = (postId, commentId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
        : post
    );
    setPosts(updatedPosts);
  };

  return (
    <div>
      <Sidebar />
      <div className="dashboard-container">
        <div className="main-content">
          <h1>EduConnect Forum</h1>

          {/* Widgets */}
          <div className="widgets">
            <div className="widget">
              <FaUsers size={24} /> AI Study Groups
            </div>
            <div className="widget">
              <FaMapMarkerAlt size={24} /> Local Learning Hubs
            </div>
          </div>

          {/* Post Form */}
          <div className="post-form">
            <input
              type="text"
              placeholder="Enter post title..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className="post-uno"
            />
            <textarea
              placeholder="Write something interesting..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            />
            <button onClick={handlePostSubmit}>Post</button>
          </div>

          {/* Post Cards */}
          <div className="posts">
            {posts.map((post) => (
              <div className="post-card" key={post.id}>
                <div className="post-header">
                  <h2>{post.title}</h2>
                  <FaTrash
                    className="delete-post"
                    onClick={() => handleDeletePost(post.id)}
                    title="Delete Post"
                  />
                </div>
                <p>{post.content}</p>

                {/* Comments Section */}
                <div className="comments-section">
                  <h3>
                    <FaCommentAlt size={16} /> Comments
                  </h3>
                  {post.comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first!</p>
                  ) : (
                    <ul className="comments-list">
                        {post.comments.map((comment) => (
                            <li key={comment.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>{comment.text}</span>
                            <small style={{ color: "gray" }}>{new Date(comment.timestamp).toLocaleString()}</small>
                            <FaTimes
                                className="delete-comment"
                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                title="Delete Comment"
                                style={{ cursor: "pointer", color: "red" }}
                            />
                            </li>
                        ))}
                    </ul>

                  )}
                  <div className="comment-box">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    />
                    <button onClick={() => handleCommentSubmit(post.id)}>Comment</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
