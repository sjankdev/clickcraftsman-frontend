import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import useApiData from "../services/useApiData";
import "../assets/css/allJobs.css"; // Update the import path

const AllJobs = () => {
  const [content, setContent] = useState("");
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
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllJobs;
