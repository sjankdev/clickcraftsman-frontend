import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ClientService from "../../services/client/client-service";
import "../../assets/css/clientJobApplicants.css";
import { Container, Button } from "react-bootstrap";

const ClientJobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [offerMessage, setOfferMessage] = useState("");

  useEffect(() => {
    console.log("Fetching applicants for jobId:", jobId);
    ClientService.getJobApplicationsForJob(jobId)
      .then((response) => {
        console.log("Received applicants:", response);
        setApplicants(response);
      })
      .catch((error) =>
        console.error(`Error fetching job applicants for job ${jobId}`, error)
      );
  }, [jobId]);

  const sendOffer = (applicationId) => {
    console.log("Sending offer to applicationId:", applicationId);
    ClientService.sendOffer(applicationId, offerMessage)
      .then((response) => {
        console.log("Offer sent successfully!", response);
      })
      .catch((error) =>
        console.error(
          "Error sending offer to applicationId:",
          applicationId,
          error
        )
      );
  };

  const declineApplication = (applicationId) => {
    console.log("Declining application:", applicationId);
    ClientService.declineApplication(applicationId)
      .then((response) => {
        console.log("Application declined successfully!", response);
      })
      .catch((error) =>
        console.error("Error declining application:", applicationId, error)
      );
  };

  return (
    <Container>
      <h2 className="mt-4">Job Applicants for Job ID: {jobId}</h2>
      {applicants.map((applicant) => (
        <div key={applicant.id} className="applicant-card">
          <p className="applicant-name">
            {applicant.freelancerId ? (
              <>
                Freelancer:{" "}
                <Link to={`/public-profile/${applicant.freelancerId}`}>
                  {applicant.freelancerFirstName} {applicant.freelancerLastName}
                </Link>
              </>
            ) : (
              <>
                Freelancer: {applicant.freelancerFirstName}{" "}
                {applicant.freelancerLastName}
              </>
            )}
          </p>
          <p className="message">Message: {applicant.messageToClient}</p>
          <p className="status">Status: {applicant.status}</p>
          <input
            type="text"
            placeholder="Enter offer message"
            value={offerMessage}
            onChange={(e) => setOfferMessage(e.target.value)}
          />
          <Button variant="success" onClick={() => sendOffer(applicant.id)}>
            Send Offer
          </Button>
          <Button
            variant="danger"
            onClick={() => declineApplication(applicant.id)}
          >
            Decline Application
          </Button>
        </div>
      ))}
    </Container>
  );
};

export default ClientJobApplicants;
