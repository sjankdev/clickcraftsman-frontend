import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import authHeader from "../services/auth-header";

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
    <div className="container">
      {userRoles.includes("ROLE_CLIENT") ? (
        <div>
          <h2>Received applications for projects</h2>
          {jobApplications.length === 0 ? (
            <p>No job applications received.</p>
          ) : (
            <ul>
              {jobApplications.map((application, index) => (
                <li key={application.id || index}>
                  <strong>Job:</strong>{" "}
                  {application.jobPosting
                    ? application.jobPosting.jobName
                    : "Job Name Not Available"}
                  <br />
                  <strong>Freelancer:</strong> {application.freelancerFirstName}{" "}
                  {application.freelancerLastName}
                  <br />
                  <strong>Message:</strong> {application.messageToClient}
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
