import React, { useState } from "react";
import "../../styles/security/LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../../assets/loginImages/client-worker-login.jpg";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("API Response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      if (!data.accessToken) {
        throw new Error("Token not found in the response");
      }
      console.log("JWT Token:", data.accessToken);

      console.log("User Details:", data);

      localStorage.setItem("token", data.accessToken);
      navigate("/clientHomepage");

    } catch (error) {
      console.error("Login error:", error.message);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container">
      <div className="login-form">
        <div className="image-section">
          <img className="image" src={loginImage} alt="Login" />
        </div>
        <div className="form-section">
          <h2>Login</h2>
          <form>
            <div className="label-input-container">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="label-input-container">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="button" onClick={handleLogin}>
              Login
            </button>
          </form>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
