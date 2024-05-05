import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ClientService from "../../services/client/client-service";
import "../../assets/css/clientJobApplicants.css";
import { AiOutlineMail, AiOutlineDollar } from 'react-icons/ai';

const ClientJobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

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

  return (
    <div className="job-applicants-container">
      <h2>Job Applicants for Job ID: {jobId}</h2>
      {applicants.map((applicant, index) => (
        <div className="job-applicant" key={index}>
          <h3>
            {applicant.freelancerId ? (
              <Link to={`/public-profile/${applicant.freelancerId}`}>
                {applicant.freelancerFirstName} {applicant.freelancerLastName}
              </Link>
            ) : (
              `${applicant.freelancerFirstName} ${applicant.freelancerLastName}`
            )}
          </h3>
          <p><AiOutlineMail /> {applicant.freelancerEmail}</p>
          <p><AiOutlineDollar /> {applicant.desiredPay}</p>
          <p>{applicant.messageToClient}</p>
        </div>
      ))}
    </div>
  );

};

export default ClientJobApplicants;
