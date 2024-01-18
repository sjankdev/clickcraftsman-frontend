import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";

const ClientPostedJobs = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [authorized, setAuthorized] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.roles && user.roles.includes("ROLE_CLIENT")) {
      UserService.getClientJobPostings()
        .then((response) => {
          setJobPostings(response || []);
        })
        .catch((error) => {
          console.error("Error fetching client job postings", error);
          setAuthorized(false); 
        });
    } else {
      console.error("Authorization error: User does not have the ROLE_CLIENT role");
      setAuthorized(false); 
    }
  }, [user]);

  return (
    <div className="container">
      {authorized ? (
        <div>
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
      ) : (
        <div>
          <h2>Authorization Error</h2>
          <p>You are not authorized to visit this page.</p>
        </div>
      )}
    </div>
  );
};

export default ClientPostedJobs;
