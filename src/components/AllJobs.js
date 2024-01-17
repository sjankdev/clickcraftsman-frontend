import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import useApiData from "../services/useApiData";

const AllJobs = () => {
  const [content, setContent] = useState("");

  const jobs = useApiData("http://localhost:8080/api/job-postings/getAllJobs");

  useEffect(() => {
    UserService.getAllJobsBoard().then(
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
        <h3>{content}</h3>
      </header>
      {content === "Freelancer Content. All Jobs" && (
        <div>
          {jobs.map((job) => (
            <div key={job.id}>
              <h3>{job.jobName}</h3>
              <p>{job.description}</p>
              <p>Date Posted: {job.datePosted}</p>
              <p>Location: {job.location}</p>
              <p>Is Remote: {job.isRemote ? "Yes" : "No"}</p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllJobs;
