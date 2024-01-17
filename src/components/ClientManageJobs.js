import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";

const ClientManageJobs = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UserService.getClientJobPostings()
      .then((response) => {
        setJobPostings(response || []);
      })
      .catch((error) => {
        console.error("Error fetching client job postings", error);
      });

    UserService.getClientJobApplications()
      .then((response) => {
        console.log("Client Job Applications Response:", response);
        setJobApplications(response || []);
      })
      .catch((error) => {
        console.error("Error fetching client job applications", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h2>My Job Postings</h2>
      {loading && <p>Loading...</p>}
      {!loading && jobPostings.length === 0 && (
        <p>No job postings available.</p>
      )}
      {!loading && jobPostings.length > 0 && (
        <ul>
          {jobPostings.map((job) => (
            <li key={job.id}>
              <strong>{job.jobName}</strong>: {job.description}
            </li>
          ))}
        </ul>
      )}

      <h2>My Job Applications</h2>
      {!loading && jobApplications.length === 0 && (
        <p>No job applications received.</p>
      )}
      {!loading && jobApplications.length > 0 && (
        <ul>
          {jobApplications.map((application, index) => (
            <li key={application.id || index}>
              <strong>Job:</strong>{" "}
              {application.jobPosting
                ? application.jobPosting.jobName
                : "Job Name Not Available"}
              <br />
              <strong>Message:</strong> {application.messageToClient}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientManageJobs;
