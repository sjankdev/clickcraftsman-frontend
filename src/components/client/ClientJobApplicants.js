import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ClientService from "../../services/client/client-service";
import "../../assets/css/clientJobApplicants.css";
import { AiOutlineMail, AiOutlineDollar, AiOutlineFilePdf } from 'react-icons/ai';

const ClientJobApplicants = () => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState({});
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    console.log("Fetching job details for jobId:", jobId);
    ClientService.getJobDetails(jobId)
      .then((response) => {
        console.log("Received job details:", response);
        setJobDetails(response);
      })
      .catch((error) =>
        console.error(`Error fetching job details for job ${jobId}`, error)
      );
  }, [jobId]);

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
    <div className="job-applicants-container-cliente">
      <h2>Job Applicants for Job: {jobDetails.jobName}</h2>
      {applicants.map((applicant, index) => (
        <div className="job-applicant-cliente" key={index}>
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
          <p>Applied On: {applicant.formattedApplicationTime}</p>
          {applicant.hasResume && (
            <a href={`http://localhost:8080/api/job/resume/${applicant.id}`} download className="resume-download-cliente">
              Download Resume <AiOutlineFilePdf />
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClientJobApplicants;