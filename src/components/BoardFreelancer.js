import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import authHeader from "../services/auth-header";

const BoardFreelancer = () => {
  const [content, setContent] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    UserService.getFreelancerBoard({ headers: authHeader() }).then(
      (response) => {
        setContent(response.data);
        setAuthorized(true);
      },
      (error) => {
        const errorMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setError(errorMessage);

        if (error.response && error.response.status === 401) {
          setError("Unauthorized.");
        }
      }
    );
  }, []);

  if (!authorized) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default BoardFreelancer;
