import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";

const ClientReceivedApplications = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <h2>Received applications for projects</h2>
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

export default ClientReceivedApplications;
