import React, { useState, useEffect } from "react";
import ClientService from "../../services/client/client-service";
import UserService from "../../services/utils/user.service";
import useApiData from "../../services/utils/useApiData";
import Select from "react-select";
import authHeader from "../../services/security/auth-header";
import "../../assets/css/jobPost.css";
const JobPostForm = () => {
  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [priceType, setPriceType] = useState("");
  const [priceRangeFrom, setPriceRangeFrom] = useState("");
  const [priceRangeTo, setPriceRangeTo] = useState("");
  const [budget, setBudget] = useState("");
  const [jobType, setJobType] = useState("");
  const [resumeRequired, setResumeRequired] = useState(false);
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

  const handlePriceTypeChange = (selectedOption) => {
    setPriceType(selectedOption.value);
    setPriceRangeFrom("");
    setPriceRangeTo("");
    setBudget("");
  };

  const handleCheckboxChange = (e) => {
    setIsRemote(e.target.checked);
    setLocation("");
  };

  const handleJobTypeChange = (selectedOption) => {
    setJobType(selectedOption.value);
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
      priceType,
      priceRangeFrom,
      priceRangeTo,
      budget,
      jobType,
      resumeRequired
    };

    ClientService.postJob(userEmail, jobPostingData)
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
    <div className="job-post-form">
      {userRoles.includes("ROLE_CLIENT") ? (
        <>
          <h2>Post a Job</h2>
          <div className="form-container">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-section">
                  <label htmlFor="jobName">Job Name</label>
                  <input
                    type="text"
                    id="jobName"
                    required
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                  />
                </div>
                <div className="form-section">
                  <label htmlFor="description">Job Description</label>
                  <textarea
                    id="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

              </div>
              <div className="form-row">
                <div className="form-section">
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

                <div className="form-section">
                  <label htmlFor="priceType">Price Type:</label>
                  <Select
                    options={[
                      { value: "PER_HOUR", label: "Per Hour" },
                      { value: "PER_MONTH", label: "Per Month" },
                      { value: "FIXED_PRICE", label: "Fixed Price" },
                    ]}
                    onChange={handlePriceTypeChange}
                  />
                </div>
                {(priceType === "PER_HOUR" || priceType === "PER_MONTH") && (
                  <div className="form-section">
                    <div className="price-range">
                      <label htmlFor="priceRangeFrom">Price Range From:</label>
                      <input
                        type="number"
                        id="priceRangeFrom"
                        value={priceRangeFrom}
                        onChange={(e) => setPriceRangeFrom(e.target.value)}
                      />
                    </div>
                    <div className="price-range">
                      <label htmlFor="priceRangeTo">Price Range To:</label>
                      <input
                        type="number"
                        id="priceRangeTo"
                        value={priceRangeTo}
                        onChange={(e) => setPriceRangeTo(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {priceType === "FIXED_PRICE" && (
                  <div className="form-section">
                    <label htmlFor="budget">Budget:</label>
                    <input
                      type="number"
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                )}
                <div className="form-section">
                  <label htmlFor="jobType">Job Type:</label>
                  <Select
                    options={[
                      { value: "FULL_TIME", label: "Full Time" },
                      { value: "PART_TIME", label: "Part Time" },
                      { value: "CONTRACT", label: "Contract" },
                      { value: "FREELANCE", label: "Freelance" },
                      { value: "INTERNSHIP", label: "Internship" },
                    ]}
                    onChange={handleJobTypeChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-section">
                  <label htmlFor="isRemote">Is Remote?</label>
                  <input
                    type="checkbox"
                    id="isRemote"
                    checked={isRemote}
                    onChange={handleCheckboxChange}
                  />
                  {!isRemote && (
                    <div className="location-section">
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
                </div>
                <div className="form-section">
                  <label htmlFor="resumeRequired">Resume Required?</label>
                  <input
                    type="checkbox"
                    id="resumeRequired"
                    checked={resumeRequired}
                    onChange={(e) => setResumeRequired(e.target.checked)}
                  />
                </div>
              </div>
              <button type="submit">Post Job</button>
            </form>
          </div>
        </>
      ) : (
        <div className="unauthorized-message">
          You are not authorized to view this content.
        </div>
      )}
    </div>
  );
  
  
};

export default JobPostForm;