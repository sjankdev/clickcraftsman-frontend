import React, { useState, useEffect } from "react";
import ClientJobPostingService from "../services/ClientJobPostingService";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import useSkills from "../services/useSkills";
import Select from "react-select";

const JobPostForm = () => {
  const skills = useSkills();

  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getUserBoard().then(
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

  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user.email;

    const jobPostingData = {
      jobName,
      description,
      requiredSkillIds: selectedSkills.map((skill) => skill.value),
    };

    console.log("Selected Skills:", selectedSkills);
    console.log("Job Posting Data:", jobPostingData);

    ClientJobPostingService.postJob(userEmail, jobPostingData)
      .then((response) => {
        setSuccessMessage("Job posted successfully!");
      })
      .catch((error) => {
        setErrorMessage(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            "An error occurred while posting the job."
        );
      });
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
      {content === "User Content." && (
        <div>
          <h2>Post a Job</h2>
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="jobName">Job Name</label>
              <input
                type="text"
                className="form-control"
                id="jobName"
                required
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Job Description</label>
              <textarea
                className="form-control"
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="skills">Select Skills:</label>
              <Select
                options={skills.map((skill) => ({
                  value: skill.skillName,
                  label: skill.skillName,
                }))}
                isMulti
                onChange={handleSkillsChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Post Job
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobPostForm;
