import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import useApiData from "../services/useApiData";
import "../assets/css/allJobs.css";

const AllJobs = () => {
  const [content, setContent] = useState("");
  const [applicationMessages, setApplicationMessages] = useState([]);

  const jobs = useApiData("http://localhost:8080/api/job-postings/getAllJobs");

  useEffect(() => {
    UserService.getAllJobsBoard()
      .then(
        (response) => {
          setContent(response.data);
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setContent(_content);

          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
        }
      );
  }, []);

  const handleApply = (jobId) => {
    const applicationData = {
      coverLetter: "Sample cover letter",
    };

    UserService.applyForJob(jobId, applicationData)
      .then((response) => {
        console.log("Job application submitted successfully");
        setApplicationMessages((prevMessages) => [
          ...prevMessages,
          { jobId, message: "Job application submitted successfully" },
        ]);
      })
      .catch((error) => {
        console.error("Error submitting job application", error);

        if (error.response && error.response.status === 400) {
          setApplicationMessages((prevMessages) => [
            ...prevMessages,
            { jobId, message: "You have already applied for this job." },
          ]);
        } else {
          setApplicationMessages((prevMessages) => [
            ...prevMessages,
            { jobId, message: "An error occurred while submitting the job application." },
          ]);
        }
      });
  };
  

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Explore Exciting Job Opportunities</h3>
      </header>

      {content === "Freelancer Content. All Jobs" && (
        <div>
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.jobName}</h3>
              <p className="job-description">{job.description}</p>
              <div className="job-details">
                <p>Date Posted: {job.datePosted}</p>
                <p>Location: {job.location}</p>
                <p>Remote: {job.isRemote ? "Yes" : "No"}</p>
              </div>
              <button onClick={() => handleApply(job.id)}>Apply</button>
              <hr />
              {applicationMessages.map((msg) => msg.jobId === job.id && <p key={msg.jobId}>{msg.message}</p>)}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllJobs;