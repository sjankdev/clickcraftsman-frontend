import React, { useState, useEffect } from "react";
import ClientJobPostingService from "../services/ClientJobPostingService";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import useApiData from "../services/useApiData";
import Select from "react-select";

const JobPostForm = () => {
  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const skills = useApiData("http://localhost:8080/api/skills/getAllSkills");
  const locations = useApiData(
    "http://localhost:8080/api/locations/getAllLocations"
  );

  useEffect(() => {
    UserService.getUserBoard()
      .then(() => {
        setUserRole("CLIENT");
        console.log("User has ROLE_CLIENT");
      })
      .catch((error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        setContent(_content);
  
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        } else {
          // If the user doesn't have access to /api/test/client, handle it accordingly
          console.error("User does not have ROLE_CLIENT:", error.response);
          setErrorMessage("Error: You are not authorized to access this resource.");
        }
      });
  }, []);
  
  
  
  
  
  

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
      {userRole === "CLIENT" ? (
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
        <div className="alert alert-danger">
          You are not authorized to access this resource.
        </div>
      )}
    </div>
  );
};

export default JobPostForm;