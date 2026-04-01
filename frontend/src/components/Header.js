import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <h1>Blog Management System</h1>
        </div>
        <nav className="nav">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            {user ? (
              <>
                <li>
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li>
                  <span className="user-info">
                    Hi, {user.name} ({user.role})
                  </span>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="/login">Login</a>
                </li>
                <li>
                  <a href="/register">Register</a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
