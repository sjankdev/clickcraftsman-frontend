import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import UserService from "../../services/utils/user.service";
import FreelancerService from "../../services/freelancer/freelancer-service";
import { formatEnum } from "../../services/utils/formatEnums";
import "../../assets/css/allJobs.css";
import authHeader from "../../services/security/auth-header";
import Select from "react-select";
import axios from "axios";

Modal.setAppElement("#root");

const FreelancerOpenProjects = () => {
  const [content, setContent] = useState("");
  const [applicationMessages, setApplicationMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [desiredPay, setDesiredPay] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [fileTypeError, setFileTypeError] = useState("");
  const [locationsList, setLocationsList] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedPriceTypes, setSelectedPriceTypes] = useState([]);
  const [priceRangeFrom, setPriceRangeFrom] = useState("");
  const [priceRangeTo, setPriceRangeTo] = useState("");
  const [budgetFrom, setBudgetFrom] = useState("");
  const [budgetTo, setBudgetTo] = useState("");
  const [jobName, setJobName] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const resumeRequirementOptions = [
    { value: "All", label: "Resume required?" },
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const [resumeRequirementFilter, setResumeRequirementFilter] = useState(
    resumeRequirementOptions[0]
  );
  useEffect(() => {
    UserService.getFreelancerOpenProjects()
      .then((response) => {
        setContent(response.data);
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

    FreelancerService.getAppliedJobs()
      .then((appliedIds) => {
        setAppliedJobIds(appliedIds);
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

    const fetchSkillsAndLocations = async () => {
      try {
        const skillsResponse = await axios.get(
          "https://clickcraftsman-backend-latest.onrender.com/api/utils/getAllSkills"
        );
        const formattedSkills = skillsResponse.data.map((skill) => ({
          value: skill.id,
          label: skill.skillName,
        }));
        setSkillsList(formattedSkills);

        const locationsResponse = await axios.get(
          "https://clickcraftsman-backend-latest.onrender.com/api/utils/getAllLocations"
        );
        const formattedLocations = locationsResponse.data.map((location) => ({
          value: location,
          label: location,
        }));
        setLocationsList(formattedLocations);
      } catch (error) {
        console.error("Error fetching skills and locations:", error);
      }
    };

    fetchSkillsAndLocations();
  }, []);

  const openModal = (jobId) => {
    setIsModalOpen(true);
    setSelectedJobId(jobId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCustomMessage("");
    setSelectedJobId(null);
    setFileTypeError("");
  };

  const handleDateFilterChange = (event) => {
    console.log(event.target.value);
    setSelectedDateFilter(event.target.value);
  };

  const handleApply = (jobId) => {
    const hasAlreadyApplied = applicationMessages.some(
      (msg) => msg.jobId === jobId
    );

    if (!hasAlreadyApplied) {
      openModal(jobId);
    } else {
      setApplicationMessages((prevMessages) => [
        ...prevMessages,
        { jobId, message: "You have already applied for this job." },
      ]);
    }
  };

  const handleApplyWithCustomMessage = () => {
    const jobId = selectedJobId;
    if (jobId) {
      const formData = new FormData();
      formData.append("messageToClient", customMessage);
      formData.append("desiredPay", desiredPay);

      if (resumeFile && !fileTypeError) {
        formData.append("resumeFile", resumeFile);
      } else {
        const job = content.find((job) => job.id === jobId);
        if (job && job.resumeRequired) {
          alert("Resume is required for this job. Please attach your resume.");
          return;
        }
      }

      FreelancerService.applyForJob(jobId, formData)
        .then((response) => {
          console.log("Job application submitted successfully");
          setApplicationMessages((prevMessages) => [
            ...prevMessages,

            { jobId, message: "Job application submitted successfully" },
          ]);
          closeModal();
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
              {
                jobId,
                message:
                  "An error occurred while submitting the job application.",
              },
            ]);
          }
          closeModal();
        });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    if (file) {
      const fileType = file.type;
      if (fileType !== "application/pdf") {
        setFileTypeError("Unsupported file format. Please upload a PDF file.");
      } else {
        setFileTypeError("");
      }
    }
  };

  const handleBudgetFromChange = (event) => {
    setBudgetFrom(event.target.value);
  };

  const handleBudgetToChange = (event) => {
    setBudgetTo(event.target.value);
  };

  const handlePriceRangeFromChange = (event) => {
    setPriceRangeFrom(event.target.value);
  };

  const handlePriceRangeToChange = (event) => {
    setPriceRangeTo(event.target.value);
  };

  const isHourlyOrMonthlySelected = () => {
    return (
      selectedPriceTypes.length === 0 ||
      selectedPriceTypes.some(
        (priceType) =>
          priceType.value === "PER_HOUR" || priceType.value === "PER_MONTH"
      )
    );
  };

  const isFixedPriceSelected = () => {
    return (
      selectedPriceTypes.length === 0 ||
      selectedPriceTypes.some((priceType) => priceType.value === "FIXED_PRICE")
    );
  };

  const handleJobNameChange = (event) => {
    const jobName = event.target.value;
    setJobName(jobName);
  };

  const handleRemoteChange = () => {
    setIsRemote(!isRemote);
  };

  const handleResumeRequirementChange = (selectedOption) => {
    setResumeRequirementFilter(selectedOption);
  };

  useEffect(() => {
    let isMounted = true;
    const delay = 300;
    const fetchProfiles = async () => {
      try {
        const queryParams = {};
        if (selectedLocations.length > 0) {
          queryParams.locations = selectedLocations
            .map((locations) => locations.value)
            .join(",");
        }
        if (selectedSkills.length > 0) {
          queryParams.skillIds = selectedSkills
            .map((skill) => skill.value)
            .join(",");
        }

        if (selectedJobTypes.length > 0) {
          queryParams.jobTypes = selectedJobTypes.map((type) =>
            type.value.toUpperCase()
          );
        }
        if (selectedPriceTypes.length > 0) {
          queryParams.priceTypes = selectedPriceTypes.map((type) =>
            type.value.toUpperCase()
          );
        }

        if (priceRangeFrom) {
          queryParams.priceRangeFrom = priceRangeFrom;
        }
        if (priceRangeTo) {
          queryParams.priceRangeTo = priceRangeTo;
        }

        if (budgetFrom) {
          queryParams.budgetFrom = budgetFrom;
        }
        if (budgetTo) {
          queryParams.budgetTo = budgetTo;
        }
        if (jobName) {
          queryParams.jobName = jobName;
        }
        if (isRemote) {
          queryParams.isRemote = isRemote;
        }
        if (resumeRequirementFilter.value !== "All") {
          queryParams.resumeRequired = resumeRequirementFilter.value === "Yes";
        }
        if (selectedDateFilter === "today") {
          queryParams.dateRange = "today";
        } else if (selectedDateFilter === "yesterday") {
          queryParams.dateRange = "yesterday";
        } else if (selectedDateFilter === "thisWeek") {
          queryParams.dateRange = "thisWeek";
        } else if (selectedDateFilter === "thisMonth") {
          queryParams.dateRange = "thisMonth";
        } else if (selectedDateFilter === "earlierThanThisMonth") {
          queryParams.dateRange = "earlierThanThisMonth";
        }

        const queryString = new URLSearchParams(queryParams).toString();
        const url = `https://clickcraftsman-backend-latest.onrender.com/api/job/searchJobs?${queryString}`;
        const response = await axios.get(url);
        if (isMounted) {
          setContent(response.data);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    const timeoutId = setTimeout(fetchProfiles, delay);
    return () => {
      clearTimeout(timeoutId);
      isMounted = false;
    };
  }, [
    jobName,
    isRemote,
    resumeRequirementFilter,
    selectedLocations,
    selectedSkills,
    selectedJobTypes,
    selectedPriceTypes,
    budgetFrom,
    budgetTo,
    priceRangeFrom,
    priceRangeTo,
    selectedDateFilter,
  ]);

  return (
    <div className="job-search-container">
      <div className="filter-section">
        <div className="filter-group">
          <input
            type="text"
            id="job-name"
            value={jobName}
            onChange={handleJobNameChange}
            placeholder="Search by keywords"
            className="input-field"
          />
        </div>
        <div className="filter-group">
          <select
            id="date-filter"
            value={selectedDateFilter}
            onChange={handleDateFilterChange}
            className="input-field"
          >
            <option value="">Posted</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This week</option>
            <option value="thisMonth">This month</option>
            <option value="earlierThanThisMonth">Older then month</option>
          </select>
        </div>
        <div className="filter-group">
          <Select
            id="resume-required-filter"
            value={resumeRequirementFilter}
            onChange={handleResumeRequirementChange}
            options={resumeRequirementOptions}
            placeholder="Resume required?"
          />
        </div>
        <div className="filter-group">
          <Select
            isMulti
            options={skillsList}
            value={selectedSkills}
            onChange={setSelectedSkills}
            placeholder="Skills"
          />
        </div>
        <div className="filter-group">
          <Select
            isMulti
            options={locationsList}
            value={selectedLocations}
            onChange={setSelectedLocations}
            placeholder="Location"
          />
        </div>
        <div className="filter-group">
          <Select
            isMulti
            options={[
              { value: "FULL_TIME", label: "Full Time" },
              { value: "PART_TIME", label: "Part Time" },
              { value: "CONTRACT", label: "Contract" },
              { value: "FREELANCE", label: "Freelance" },
              { value: "INTERNSHIP", label: "Internship" },
            ]}
            value={selectedJobTypes}
            onChange={setSelectedJobTypes}
            placeholder="Job type"
          />
        </div>
        <div className="filter-group">
          <Select
            isMulti
            options={[
              { value: "PER_HOUR", label: "Per hour" },
              { value: "PER_MONTH", label: "Per month" },
              { value: "FIXED_PRICE", label: "Fixed price" },
            ]}
            value={selectedPriceTypes}
            onChange={setSelectedPriceTypes}
            placeholder="Payment type"
          />
        </div>
        {isFixedPriceSelected() && (
          <div className="filter-group">
            <input
              type="number"
              id="budget-from"
              value={budgetFrom}
              onChange={handleBudgetFromChange}
              placeholder="Budget from..."
              className="input-field"
            />
            <input
              type="number"
              id="budget-to"
              value={budgetTo}
              onChange={handleBudgetToChange}
              placeholder="Budget to..."
              className="input-field"
            />
          </div>
        )}
        {isHourlyOrMonthlySelected() && (
          <div className="filter-group">
            <input
              type="number"
              id="priceFrom"
              value={priceRangeFrom}
              onChange={handlePriceRangeFromChange}
              placeholder="Per hour from..."
              className="input-field"
            />
            <input
              type="number"
              id="priceTo"
              value={priceRangeTo}
              onChange={handlePriceRangeToChange}
              placeholder="Per hour to..."
              className="input-field"
            />
          </div>
        )}
        <div className="filter-group checkbox-group">
          <label htmlFor="is-remote">Remote?</label>
          <input
            type="checkbox"
            id="is-remote"
            checked={isRemote}
            onChange={handleRemoteChange}
          />
        </div>
      </div>
      <div className="job-list">
        {Array.isArray(content) &&
          content.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.jobName}</h3>
              <p>{job.description}</p>
              {job.priceType === "FIXED_PRICE" ? (
                <div>
                  <p>Price Type: {formatEnum(job.priceType)}</p>
                  <p>Budget: ${job.budget}</p>
                </div>
              ) : (
                <div>
                  Price Type: {formatEnum(job.priceType)}
                  <p>
                    {job.priceRangeFrom}$ - ${job.priceRangeTo}
                  </p>
                </div>
              )}
              <p>Job Type: {formatEnum(job.jobType)}</p>
              <div>
                <p>Posted: {job.formattedApplicationTime}</p>
                {job.location && <p>Location: {job.location}</p>}
                {!job.location && <p>{job.isRemote ? "Remote" : "No"}</p>}
                <p>Required Skills: {job.requiredSkillNames.join(", ")}</p>
              </div>
              {appliedJobIds.includes(job.id) ? (
                <p>You have already applied for this job.</p>
              ) : (
                <>
                  <button onClick={() => handleApply(job.id)}>Apply</button>
                  <hr />
                  {applicationMessages.map(
                    (msg) =>
                      msg.jobId === job.id && (
                        <p key={msg.jobId}>{msg.message}</p>
                      )
                  )}
                  <Modal
                    isOpen={isModalOpen && selectedJobId === job.id}
                    onRequestClose={closeModal}
                    contentLabel="Custom Message Modal"
                    className="custom-modal"
                    overlayClassName="custom-modal-overlay"
                  >
                    <div className="modal-header">
                      <h2>You're applying for {job.jobName}</h2>
                      <button onClick={closeModal} className="close-button">
                        &times;
                      </button>
                    </div>
                    <div className="modal-body">
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Insert your message here..."
                        className="custom-textarea"
                      />
                      <div className="input-group">
                        <input
                          type="number"
                          id="desired-pay"
                          value={desiredPay}
                          onChange={(e) => setDesiredPay(e.target.value)}
                          placeholder="Insert your desired pay here..."
                          className="custom-input"
                        />
                      </div>
                      {job.priceType === "FIXED_PRICE" ? (
                        <div className="price-info">
                          <p>Price Type: {formatEnum(job.priceType)}</p>
                          <p>Budget: ${job.budget}</p>
                        </div>
                      ) : (
                        <div className="price-info">
                          <p>Price Type: {formatEnum(job.priceType)}</p>
                          <p>
                            {job.priceRangeFrom}$ - ${job.priceRangeTo}
                          </p>
                        </div>
                      )}
                      <div className="input-group">
                        <label htmlFor="resume-upload" className="upload-label">
                          Upload your resume:{" "}
                          {job.resumeRequired ? "(required)" : "(optional)"}
                          <input
                            type="file"
                            id="resume-upload"
                            onChange={handleFileChange}
                            accept=".pdf"
                            className="browse-button"
                          />
                        </label>
                        <div className="file-info">
                          {fileTypeError && (
                            <div className="error-message">{fileTypeError}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        onClick={handleApplyWithCustomMessage}
                        className="custom-button"
                      >
                        Apply
                      </button>
                      <button
                        onClick={closeModal}
                        className="custom-button cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </Modal>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default FreelancerOpenProjects;
