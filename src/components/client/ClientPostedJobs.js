import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClientService from "../../services/client/client-service";
import authHeader from "../../services/security/auth-header";
import "../../assets/css/clientPostedJobs.css";
import { Container, Alert, ListGroup, Spinner } from "react-bootstrap";

const ClientPostedJobs = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ClientService.getClientJobPostings()
      .then((response) => {
        setJobPostings(response || []);
        setLoading(false);
      })
      .catch((error) => {
        const unauthorizedError =
          error.response && error.response.status === 401;

        if (unauthorizedError) {
          setErrorMessage("You are not authorized to view this content.");
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
        setLoading(false);
      });
  }, []);

  const userRoles = authHeader().roles || [];

  return (
    <Container>
      {userRoles.includes("ROLE_CLIENT") ? (
        <div>
          <h2 className="my-4">My Job Postings</h2>
          {loading && <Spinner animation="border" className="text-muted" />}
          {errorMessage && !loading && (
            <Alert variant="danger" className="mt-4">
              {errorMessage}
            </Alert>
          )}
          {jobPostings.length > 0 ? (
            <ListGroup className="mt-4">
              {jobPostings.map((job) => (
                <ListGroup.Item key={job.id}>
                  <h5>{job.jobName}</h5>
                  <p>{job.description}</p>
                  <Link to={`/client/job/${job.id}`}>View Applicants</Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div>
              {!loading && (
                <Alert variant="warning" className="mt-4">
                  No job postings available.
                </Alert>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <Alert variant="danger">
            You are not authorized to view this content.
          </Alert>
        </div>
      )}
    </Container>
  );
};

export default ClientPostedJobs;
