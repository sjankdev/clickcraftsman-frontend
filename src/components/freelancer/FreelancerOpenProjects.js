import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import UserService from "../../services/utils/user.service";
import FreelancerService from "../../services/freelancer/freelancer-service";
import useApiData from "../../services/utils/useApiData";
import "../../assets/css/allJobs.css";
import authHeader from "../../services/security/auth-header";

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
  const jobs = useApiData("http://localhost:8080/api/job/getAllJobs");

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
  }, []);

  const userRoles = authHeader().roles || [];

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
      formData.append('messageToClient', customMessage);
      formData.append('desiredPay', desiredPay);

      if (resumeFile && !fileTypeError) {
        formData.append('resumeFile', resumeFile);
      } else {
        if (jobs.find(job => job.id === jobId).resumeRequired) {
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
                message: "An error occurred while submitting the job application.",
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

  return (
    <div className="container">
      {userRoles.includes("ROLE_FREELANCER") ? (
        <div className="jobs-container">
          {jobs
            .filter((job) => !job.archived)
            .map((job) => (
              <div key={job.id} className="job-card">
                <h3>{job.jobName}</h3>
                <p className="job-description">{job.description}</p>
                <div className="job-details">
                  <p>{job.datePosted}</p>
                  {job.location && <p>Location: {job.location}</p>}
                  {!job.location && (
                    <p>{job.isRemote ? "Remote" : "No"}</p>
                  )}
                  <p>
                    Required Skills:{" "}
                    {job.requiredSkills
                      .map((skill) => skill.skillName)
                      .join(", ")}
                  </p>
                  {job.priceType === "FIXED_PRICE" && (
                    <div>
                      <p>Price type: {job.priceType}</p>
                      <p>Budget: ${job.budget}</p>
                    </div>
                  )}
                  {job.priceType !== "FIXED_PRICE" && (
                    <div>
                      <p>Price Type: {job.priceType}</p>
                      <p>
                        {job.priceRangeFrom}$ - ${job.priceRangeTo}
                      </p>
                    </div>
                  )}
                </div>
                {appliedJobIds.includes(job.id) ? (
                  <p className="already-applied">
                    You have already applied for this job.
                  </p>
                ) : (
                  <div>
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
                        <button className="close-btn" onClick={closeModal}>
                          &times;
                        </button>
                      </div>
                      <div className="modal-body">
                        <h3>Enter Your Custom Message</h3>
                        <textarea
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          className="message-textarea"
                          placeholder="Insert your message here..."
                        />
                        <div className="input-group">
                          <label htmlFor="desired-pay" className="pay-label">
                            Desired Pay:
                          </label>
                          <input
                            type="number"
                            id="desired-pay"
                            value={desiredPay}
                            onChange={(e) => setDesiredPay(e.target.value)}
                            className="desired-pay-input"
                            placeholder="Insert your desired pay here..."
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="resume-upload" className="file-label">
                            Upload your resume:
                          </label>
                          <input
                            type="file"
                            id="resume-upload"
                            onChange={handleFileChange}
                            accept=".pdf"
                            className="file-upload-input"
                          />
                          <div>
                            <span className="file-upload-info">Supported format: PDF</span>
                            {fileTypeError && (
                              <div className="error-message">{fileTypeError}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          onClick={handleApplyWithCustomMessage}
                          className="apply-btn"
                        >
                          Apply
                        </button>
                        <button onClick={closeModal} className="cancel-btn">
                          Cancel
                        </button>
                      </div>
                    </Modal>
                  </div>
                )}
              </div>
            ))}
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

export default FreelancerOpenProjects;
