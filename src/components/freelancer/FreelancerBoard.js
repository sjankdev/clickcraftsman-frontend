import React, { useState, useEffect } from "react";
import UserService from "../../services/utils/user.service";
import authHeader from "../../services/security/auth-header";

const FreelancerBoard = () => {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UserService.getFreelancerBoard()
      .then((response) => {
        setContent(response.data);
        setErrorMessage("");
        setLoading(false);
      })
      .catch((error) => {
        const unauthorizedError =
          error.response && error.response.status === 401;

        if (unauthorizedError) {
          setErrorMessage("You are not authorized to view this content.");
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
        setLoading(false);
      });
  }, []);

  const userRoles = authHeader().roles || [];

  return (
    <div className="container">
      {userRoles.includes("ROLE_FREELANCER") ? (
        <div>
          <h1>Freelancer verified</h1>
        </div>
      ) : (
        <div>
          <div className="alert alert-danger">
            You are not authorized to view this content.
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerBoard;
