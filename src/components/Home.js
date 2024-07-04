import React, { useState, useEffect } from "react";
import UserService from "../services/utils/user.service";
import "../assets/css/home.css";

const Home = () => {
  const [content, setContent] = useState("");

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
        <div className="buttons">
          <a href="/register" className="btn btn-primary mr-2">Sign Up</a>
          <a href="/login" className="btn btn-outline-primary">Log In</a>
        </div>
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
