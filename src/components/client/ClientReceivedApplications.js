import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClientService from "../../services/client/client-service";
import authHeader from "../../services/security/auth-header";
import "../../assets/css/clientReceivedApplications.css";
import { AiOutlineFilePdf } from 'react-icons/ai';

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
    <div className="applications-wrapper-clienetee">
      {userRoles.includes("ROLE_CLIENT") ? (
        <>
          <h2 className="page-title-clienetee">Received Applications for Projects</h2>
          {jobApplications.length === 0 ? (
            <p className="no-applications-msg-clienetee">No job applications received.</p>
          ) : (
            <div className="applications-container-clienetee">
              {jobApplications.map((application, index) => {
                return (
                  <div key={index} className="application-item-clienetee">
                    <div className="freelancer-info-clienetee">
                      <strong>Freelancer:</strong>{" "}
                      {application.freelancerId ? (
                        <Link to={`/public-profile/${application.freelancerId}`}>
                          {application.freelancerFirstName} {application.freelancerLastName}
                        </Link>
                      ) : (
                        <span className="invalid-freelancer-id-clienetee">Invalid freelancerId: null</span>
                      )}
                    </div>
                    <div className="message-info-clienetee">
                      <strong>Message:</strong> {application.messageToClient}
                      <br></br>
                      <strong>Desired pay:</strong> {application.desiredPay}
                      <br></br>
                      <p>Applied On: {application.formattedApplicationTime}</p>
                    </div>
                    {application.hasResume ? (
                      <a href={`https://clickcraftsman-backend-latest.onrender.com/api/job/resume/${application.id}`} download className="resume-download-clienetee">
                        Download Resume <AiOutlineFilePdf />
                      </a>
                    ) : (
                      <div className="no-resume-msg-clienetee">No resume uploaded</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="alert-clienetee alert-danger-clienetee">
          You are not authorized to view this content.
        </div>
      )}
    </div>
  );
};

export default ClientReceivedApplications;
