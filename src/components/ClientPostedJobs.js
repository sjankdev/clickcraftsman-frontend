import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import authHeader from "../services/auth-header";

const ClientPostedJobs = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UserService.getClientJobPostings()
      .then((response) => {
        setJobPostings(response || []);
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
      {userRoles.includes("ROLE_CLIENT") ? (
        <div>
          <h2>My Job Postings</h2>
          {loading && <div>Loading...</div>}
          {errorMessage && !loading && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          {jobPostings.length > 0 ? (
            <ul>
              {jobPostings.map((job) => (
                <li key={job.id}>
                  <strong>{job.jobName}</strong>: {job.description}
                </li>
              ))}
            </ul>
          ) : (
            <div>
              {!loading && (
                <div className="alert alert-danger">
                  No job postings available.
                </div>
              )}
            </div>
          )}
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

export default ClientPostedJobs;
