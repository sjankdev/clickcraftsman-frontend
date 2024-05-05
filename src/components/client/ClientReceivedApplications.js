import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClientService from "../../services/client/client-service";
import authHeader from "../../services/security/auth-header";
import "../../assets/css/clientReceivedApplications.css";

const ClientReceivedApplications = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching job applications...");

    ClientService.getClientJobApplications()
      .then((response) => {
        console.log("Received job applications:", response);
        setJobApplications(response || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job applications:", error);

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

  console.log("Rendering ClientReceivedApplications component...");

  return (
    <div className="container client-received-applications">
      {userRoles.includes("ROLE_CLIENT") ? (
        <div>
          <h2 className="page-title">Received Applications for Projects</h2>
          {jobApplications.length === 0 ? (
            <p className="no-applications-msg">No job applications received.</p>
          ) : (
            <div className="applications-container">
              {jobApplications.map((application, index) => {
                console.log("Rendering Application object:", application);
                return (
                  <div key={index} className="application-item">
                    <div className="freelancer-info">
                      <strong>Freelancer:</strong>{" "}
                      {application.freelancerId ? (
                        <Link to={`/public-profile/${application.freelancerId}`}>
                          {application.freelancerFirstName} {application.freelancerLastName}{" "}
                          <br></br>
                          <strong>Desired pay: {application.desiredPay}</strong>
                          Email: {application.freelancerEmail}
                        </Link>
                      ) : (
                        <span className="invalid-freelancer-id">
                          Invalid freelancerId: null
                        </span>
                      )}
                    </div>
                    <div className="message-info">
                      <strong>Message:</strong> {application.messageToClient}
                    </div>
                    <a href={`http://localhost:8080/api/job/resume/${application.id}`} download>Download Resume</a>
                  </div>
                );
              })}
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

export default ClientReceivedApplications;
