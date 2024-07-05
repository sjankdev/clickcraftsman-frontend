import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserService from "../services/utils/user.service";
import "../assets/css/home.css";

const Home = () => {
  const [content, setContent] = useState("");
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h1>Welcome to Our Platform</h1>
        {!isLoggedIn && (
          <div className="buttons">
            <Link to="/register" className="btn btn-primary mr-2">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-outline-primary">
              Log In
            </Link>
          </div>
        )}
      </header>
      <section className="features">
        <div className="feature">
          <h2>Find Jobs</h2>
          <p>Explore a variety of freelance opportunities.</p>
        </div>
        <div className="feature">
          <h2>Hire Freelancers</h2>
          <p>Post your projects and find talented freelancers.</p>
        </div>
        <div className="feature">
          <h2>Grow Your Career</h2>
          <p>Build your portfolio and skills.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
