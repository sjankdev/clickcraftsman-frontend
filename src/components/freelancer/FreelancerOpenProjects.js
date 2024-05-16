import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import UserService from "../../services/utils/user.service";
import FreelancerService from "../../services/freelancer/freelancer-service";
import useApiData from "../../services/utils/useApiData";
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
          "http://localhost:8080/api/utils/getAllSkills"
        );
        const formattedSkills = skillsResponse.data.map((skill) => ({
          value: skill.id,
          label: skill.skillName,
        }));
        setSkillsList(formattedSkills);

        const locationsResponse = await axios.get(
          "http://localhost:8080/api/utils/getAllLocations"
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

  const isFixedPriceSelected = () => {
    return (
      selectedPriceTypes.length === 0 ||
      selectedPriceTypes.some((priceType) => priceType.value === "FIXED_PRICE")
    );
  };


  const isHourlyOrMonthlySelected = () => {
    return (
      selectedPriceTypes.length === 0 ||
      selectedPriceTypes.some(
        (priceType) =>
          priceType.value !== "PER_HOUR" && priceType.value !== "PER_MONTH"
      )
    );
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
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `http://localhost:8080/api/job/searchJobs?${queryString}`;
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
    selectedLocations,
    selectedSkills,
    selectedJobTypes,
    selectedPriceTypes,
    budgetFrom,
    budgetTo,
    priceRangeFrom,
    priceRangeTo,
  ]);

  return (
    <div className="jobs-container-freelancere">
      <div className="custom-select-wrapper">
        <Select
          isMulti
          options={skillsList}
          value={selectedSkills}
          onChange={setSelectedSkills}
          placeholder="Select skills..."
        />
      </div>
      <div className="custom-select-wrapper">
        <Select
          isMulti
          options={locationsList}
          value={selectedLocations}
          onChange={setSelectedLocations}
          placeholder="Select locations..."
        />
      </div>
      <div className="custom-select-wrapper">
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
          placeholder="Select job types..."
        />
      </div>
      <div className="custom-select-wrapper">
        <Select
          isMulti
          options={[
            { value: "PER_HOUR", label: "Per hour" },
            { value: "PER_MONTH", label: "Per month" },
            { value: "FIXED_PRICE", label: "Fixed price" },
          ]}
          value={selectedPriceTypes}
          onChange={setSelectedPriceTypes}
          placeholder="Select price types..."
        />
      </div>
      {isFixedPriceSelected() && (
        <>
          <div>
            <label htmlFor="price-range-from">Price Range From:</label>
            <input
              type="number"
              id="price-range-from"
              value={priceRangeFrom}
              onChange={handlePriceRangeFromChange}
              placeholder="Enter minimum price..."
            />
          </div>
          <div>
            <label htmlFor="price-range-to">Price Range To:</label>
            <input
              type="number"
              id="price-range-to"
              value={priceRangeTo}
              onChange={handlePriceRangeToChange}
              placeholder="Enter maximum price..."
            />
          </div>
        </>
      )}
      {isHourlyOrMonthlySelected() && (
        <div>
          <label htmlFor="budgetFrom">Budget From:</label>
          <input
            type="number"
            id="budgetFrom"
            value={budgetFrom}
            onChange={handleBudgetFromChange}
            placeholder="Enter budget from..."
          />
          <label htmlFor="budgetTo">Budget To:</label>
          <input
            type="number"
            id="budgetTo"
            value={budgetTo}
            onChange={handleBudgetToChange}
            placeholder="Enter budget to..."
          />
        </div>
      )}
      {Array.isArray(content) &&
        content.map((job) => (
          <div className="job-card-freelancere" key={job.id}>
            <h3>{job.jobName}</h3>
            <p>{job.description}</p>
            {job.priceType === "FIXED_PRICE" ? (
              <div>
                <p>Price type: {job.priceType}</p>
                <p>Budget: ${job.budget}</p>
              </div>
            ) : (
              <div>
                <p>Price Type: {job.priceType}</p>
                <p>
                  {job.priceRangeFrom}$ - ${job.priceRangeTo}
                </p>
              </div>
            )}
            <p>{job.jobType}</p>
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
                    msg.jobId === job.id && <p key={msg.jobId}>{msg.message}</p>
                )}
                <Modal
                  isOpen={isModalOpen && selectedJobId === job.id}
                  onRequestClose={closeModal}
                  contentLabel="Custom Message Modal"
                  className="custom-modal-freelancere"
                  overlayClassName="custom-modal-overlay-freelancere"
                >
                  <div>
                    <h2>You're applying for {job.jobName}</h2>
                    <button onClick={closeModal}>&times;</button>
                  </div>
                  <div>
                    <h3>Enter Your Custom Message</h3>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Insert your message here..."
                    />
                    <div>
                      <label htmlFor="desired-pay">Desired Pay:</label>
                      <input
                        type="number"
                        id="desired-pay"
                        value={desiredPay}
                        onChange={(e) => setDesiredPay(e.target.value)}
                        placeholder="Insert your desired pay here..."
                      />
                    </div>
                    {job.priceType === "FIXED_PRICE" ? (
                      <div>
                        <p>Price type: {job.priceType}</p>
                        <p>Budget: ${job.budget}</p>
                      </div>
                    ) : (
                      <div>
                        <p>Price Type: {job.priceType}</p>
                        <p>
                          {job.priceRangeFrom}$ - ${job.priceRangeTo}
                        </p>
                      </div>
                    )}
                    <div>
                      <label htmlFor="resume-upload">
                        Upload your resume:{" "}
                        {job.resumeRequired ? "(required)" : "(optional)"}
                      </label>
                      <input
                        type="file"
                        id="resume-upload"
                        onChange={handleFileChange}
                        accept=".pdf"
                      />
                      <div>
                        <span>Supported format: PDF</span>
                        {fileTypeError && <div>{fileTypeError}</div>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button onClick={handleApplyWithCustomMessage}>
                      Apply
                    </button>
                    <button onClick={closeModal}>Cancel</button>
                  </div>
                </Modal>
              </>
            )}
          </div>
        ))}
    </div>
  );
};

export default FreelancerOpenProjects;
