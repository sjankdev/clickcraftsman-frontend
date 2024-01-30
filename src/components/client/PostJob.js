import React, { useState, useEffect } from "react";
import ClientJobPostingService from "../../services/ClientJobPostingService";
import UserService from "../../services/user.service";
import useApiData from "../../services/useApiData";
import Select from "react-select";
import authHeader from "../../services/auth-header";

const JobPostForm = () => {
  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);

  const skills = useApiData("http://localhost:8080/api/utils/getAllSkills");
  const locations = useApiData(
    "http://localhost:8080/api/utils/getAllLocations"
  );

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const unauthorizedError =
          error.response && error.response.status === 401;

        if (unauthorizedError) {
          setErrorMessage("You are not authorized to view this content.");
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      }
    );
  }, []);

  const userRoles = authHeader().roles || [];

  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions || []);
  };

  const handleLocationChange = (selectedOption) => {
    setLocation(selectedOption.value);
  };

  const handleCheckboxChange = (e) => {
    setIsRemote(e.target.checked);
    setLocation("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user.email;

    const jobPostingData = {
      jobName,
      description,
      requiredSkillIds: selectedSkills.map((skill) => skill.value),
      isRemote,
      location,
    };

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
      {userRoles.includes("ROLE_CLIENT") ? (
        <div>
          <h2>Post a Job</h2>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
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
              <label htmlFor="skills">Required Skills:</label>
              <Select
                options={skills.map((skill) => ({
                  value: skill.skillName,
                  label: skill.skillName,
                }))}
                isMulti
                onChange={handleSkillsChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="isRemote">Is Remote?</label>
              <input
                type="checkbox"
                id="isRemote"
                checked={isRemote}
                onChange={handleCheckboxChange}
              />
            </div>
            {isRemote ? null : (
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <Select
                  options={locations.map((location) => ({
                    value: location,
                    label: location,
                  }))}
                  onChange={handleLocationChange}
                />
              </div>
            )}
           <button type="submit" className="btn btn-primary">
              Post Job
            </button>
            </form>
        </div>
      ) : (
        <div>
          <div className="alert alert-danger">
            You are not authorized to view this content.
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostForm;