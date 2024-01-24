import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserService from "../services/user.service";

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
    <div>
      <h2>Job Applicants for Job ID: {jobId}</h2>
      {applicants.map((applicant) => (
        <div key={applicant.id}>
          <p>
            Freelancer: {applicant.freelancerFirstName}{" "}
            {applicant.freelancerLastName}
          </p>
          <p>Message: {applicant.messageToClient}</p>
        </div>
      ))}
    </div>
  );
};

export default ClientJobApplicants;
