import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";

const ClientReceivedApplications = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.roles && user.roles.includes("ROLE_CLIENT")) {
      UserService.getClientJobApplications()
        .then((response) => {
          console.log("Client Job Applications Response:", response);
          setJobApplications(response || []);
        })
        .catch((error) => {
          console.error("Error fetching client job applications", error);
          setAuthorized(false); 
        })
        .finally(() => setLoading(false));
    } else {
      console.error("Authorization error: User does not have the ROLE_CLIENT role");
      setAuthorized(false); 
      setLoading(false); 
    }
  }, [user]);

  return (
    <div className="container">
      {authorized ? (
        <div>
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
      ) : (
        <div>
          <h2>Authorization Error</h2>
          <p>You are not authorized to visit this page.</p>
        </div>
      )}
    </div>
  );
};

export default ClientReceivedApplications;
