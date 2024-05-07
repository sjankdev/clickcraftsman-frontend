import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClientService from "../../services/client/client-service";
import authHeader from "../../services/security/auth-header";
import "../../assets/css/clientPostedJobs.css";

const ClientPostedJobs = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [archivedJobPostings, setArchivedJobPostings] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ClientService.getClientJobPostings();
        const activeJobs = response.filter(job => !job.archived);
        const archivedJobs = response.filter(job => job.archived);
        setJobPostings(activeJobs || []);
        setArchivedJobPostings(archivedJobs || []);
        setLoading(false);
      } catch (error) {
        const unauthorizedError = error.response && error.response.status === 401;
        setErrorMessage(unauthorizedError ? "You are not authorized to view this content." : "An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userRoles = authHeader().roles || [];

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await ClientService.deleteJobPosting(jobId);
        setJobPostings(jobPostings.filter(job => job.id !== jobId));
      } catch (error) {
        console.error('Error deleting job posting:', error);
      }
    }
  };

  const handleToggleArchive = async (jobId, isArchived) => {
    const confirmMessage = isArchived ? "Are you sure you want to unarchive this job posting?" : "Are you sure you want to archive this job posting?";
    if (window.confirm(confirmMessage)) {
      try {
        if (isArchived) {
          await ClientService.unarchiveJobPosting(jobId);
          const updatedJobPostings = jobPostings.filter(job => job.id !== jobId);
          const unarchivedJob = archivedJobPostings.find(job => job.id === jobId);
          setJobPostings([...updatedJobPostings, unarchivedJob]);
          setArchivedJobPostings(archivedJobPostings.filter(job => job.id !== jobId));
        } else {
          await ClientService.archiveJobPosting(jobId);
          const updatedJobPostings = jobPostings.filter(job => job.id !== jobId);
          const archivedJob = jobPostings.find(job => job.id === jobId);
          setJobPostings(updatedJobPostings);
          setArchivedJobPostings([...archivedJobPostings, archivedJob]);
        }
      } catch (error) {
        console.error('Error toggling archive status:', error);
      }
    }
  };

  return (
    <div className="container-clients">
      {userRoles.includes("ROLE_CLIENT") ? (
        <>
          <h2>My Job Postings</h2>
          {loading && <div>Loading...</div>}
          {errorMessage && !loading && (
            <div className="error-clients">
              Error: {errorMessage}
            </div>
          )}
          {jobPostings.length > 0 ? (
            <div className="job-postings-clients">
              {jobPostings.map((job) => (
                <div key={job.id} className="job-card-clients">
                  <h3>{job.jobName}</h3>
                  <p className="job-description-clients">{job.description}</p>
                  <div className="button-group-clients">
                    <a href={`/client/job/${job.id}`} className="view-applicants-clients btn-clients btn-view-clients">View Applicants</a>
                    <button onClick={() => handleDeleteJob(job.id)} className="btn-clients btn-delete-clients">Delete</button>
                    <button onClick={() => handleToggleArchive(job.id, false)} className="btn-clients btn-archive-clients">Archive</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {!loading && (
                <div className="no-job-postings-clients">
                  No active job postings available.
                </div>
              )}
            </>
          )}
          {archivedJobPostings.length > 0 && (
            <>
              <h2>Archived Job Postings</h2>
              <div className="archived-job-postings-clients">
                {archivedJobPostings.map((job) => (
                  <div key={job.id} className="job-card-clients">
                    <h3>{job.jobName}</h3>
                    <p className="job-description-clients">{job.description}</p>
                    <div className="button-group-clients">
                      <a href={`/client/job/${job.id}`} className="view-applicants-clients btn-clients btn-view-clients">View Applicants</a>
                      <button onClick={() => handleToggleArchive(job.id, true)} className="btn-clients btn-unarchive-clients">Unarchive</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="unauthorized">
          You are not authorized to view this content.
        </div>
      )}
    </div>
  );
};

export default ClientPostedJobs;
