import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import authHeader from "../services/auth-header";
import "../assets/css/clientReceivedApplications.css";

const ClientReceivedApplications = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UserService.getClientJobApplications()
      .then((response) => {
        setJobApplications(response || []);
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
    <div className="container client-received-applications">
      {userRoles.includes("ROLE_CLIENT") ? (
        <div>
          <h2 className="page-title">Received Applications for Projects</h2>
          {jobApplications.length === 0 ? (
            <p className="no-applications-msg">No job applications received.</p>
          ) : (
            <ul className="applications-list">
              {jobApplications.map((application, index) => (
                <li key={application.id || index} className="application-item">
                  <div className="job-info">
                    <strong>Job:</strong>{" "}
                    {application.jobPosting
                      ? application.jobPosting.jobName
                      : "Job Name Not Available"}
                  </div>
                  <div className="freelancer-info">
                    <strong>Freelancer:</strong>{" "}
                    {application.freelancerFirstName} {application.freelancerLastName}
                  </div>
                  <div className="message-info">
                    <strong>Message:</strong> {application.messageToClient}
                  </div>
                </li>
              ))}
            </ul>
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

export default ClientReceivedApplications;