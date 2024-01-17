import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";

const ClientPostedJobs = () => {
  const [jobPostings, setJobPostings] = useState([]);

  useEffect(() => {
    UserService.getClientJobPostings()
      .then((response) => {
        setJobPostings(response || []);
      })
      .catch((error) => {
        console.error("Error fetching client job postings", error);
      });
  }, []);

  return (
    <div className="container">
      <h2>My Job Postings</h2>
      {jobPostings.length > 0 && (
        <ul>
          {jobPostings.map((job) => (
            <li key={job.id}>
              <strong>{job.jobName}</strong>: {job.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientPostedJobs;
