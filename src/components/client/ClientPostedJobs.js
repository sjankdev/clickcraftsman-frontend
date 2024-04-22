import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClientService from "../../services/client/client-service";
import authHeader from "../../services/security/auth-header";
import "../../assets/css/clientPostedJobs.css";
import { Container, Alert, ListGroup, Spinner } from "react-bootstrap";

const ClientPostedJobs = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [archivedJobPostings, setArchivedJobPostings] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ClientService.getClientJobPostings()
      .then((response) => {
        const activeJobs = response.filter(job => !job.archived);
        const archivedJobs = response.filter(job => job.archived);
        setJobPostings(activeJobs || []);
        setArchivedJobPostings(archivedJobs || []);
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

  const handleDeleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      ClientService.deleteJobPosting(jobId)
        .then(() => {
          setJobPostings(jobPostings.filter(job => job.id !== jobId));
        })
        .catch((error) => {
          console.error('Error deleting job posting:', error);
        });
    }
  };

  const handleArchiveJob = (jobId) => {
    if (window.confirm("Are you sure you want to archive this job posting?")) {
      ClientService.archiveJobPosting(jobId)
        .then(() => {
          const updatedJobPostings = jobPostings.filter(job => job.id !== jobId);
          const archivedJob = jobPostings.find(job => job.id === jobId);
          setJobPostings(updatedJobPostings);
          setArchivedJobPostings([...archivedJobPostings, archivedJob]);
        })
        .catch((error) => {
          console.error('Error archiving job posting:', error);
        });
    }
  };

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
                  <button onClick={() => handleDeleteJob(job.id)} className="btn btn-danger ml-2">Delete</button>
                  <button onClick={() => handleArchiveJob(job.id)} className="btn btn-warning ml-2">Archive</button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div>
              {!loading && (
                <Alert variant="warning" className="mt-4">
                  No active job postings available.
                </Alert>
              )}
            </div>
          )}
          {archivedJobPostings.length > 0 && (
            <div>
              <h2 className="my-4">Archived Job Postings</h2>
              <ListGroup className="mt-4">
                {archivedJobPostings.map((job) => (
                  <ListGroup.Item key={job.id}>
                    <h5>{job.jobName}</h5>
                    <p>{job.description}</p>
                    <Link to={`/client/job/${job.id}`}>View Applicants</Link>
                  </ListGroup.Item>
                ))}
              </ListGroup>
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
