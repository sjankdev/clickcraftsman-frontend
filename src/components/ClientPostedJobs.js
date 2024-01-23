import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import authHeader from "../services/auth-header";
import "../assets/css/clientPostedJobs.css";

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
          <h2 className="my-4">My Job Postings</h2>
          {loading && <div className="text-muted">Loading...</div>}
          {errorMessage && !loading && (
            <div className="alert alert-danger mt-4">{errorMessage}</div>
          )}
          {jobPostings.length > 0 ? (
            <ul className="list-group mt-4">
              {jobPostings.map((job) => (
                <li key={job.id} className="list-group-item job-item">
                  <h5 className="mb-1">{job.jobName}</h5>
                  <p className="mb-1">{job.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              {!loading && (
                <div className="alert alert-warning mt-4">
                  No job postings available.
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <div className="alert alert-danger">
            You are not authorized to view this content.
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPostedJobs;
