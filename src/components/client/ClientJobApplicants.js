import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import UserService from "../../services/user.service";
import "../../assets/css/clientJobApplicants.css";
import { Container } from "react-bootstrap";

const ClientJobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    console.log("Fetching applicants for jobId:", jobId);
    UserService.getJobApplicationsForJob(jobId)
      .then((response) => {
        console.log("Received applicants:", response);
        setApplicants(response);
      })
      .catch((error) =>
        console.error(`Error fetching job applicants for job ${jobId}`, error)
      );
  }, [jobId]);

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
        </div>
      ))}
    </Container>
  );
};

export default ClientJobApplicants;
