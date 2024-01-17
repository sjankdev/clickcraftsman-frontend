import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import useApiData from "../services/useApiData";
import "../assets/css/allJobs.css";

Modal.setAppElement("#root");

const AllJobs = () => {
  const [content, setContent] = useState("");
  const [applicationMessages, setApplicationMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

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

    UserService.getAppliedJobs().then((appliedIds) => {
      setAppliedJobIds(appliedIds);
    });
  }, []);

  const openModal = (jobId) => {
    const hasAlreadyApplied = applicationMessages.some((msg) => msg.jobId === jobId);

    if (!hasAlreadyApplied) {
      setIsModalOpen(true);
      setSelectedJobId(jobId);
    } else {
      setApplicationMessages((prevMessages) => [
        ...prevMessages,
        { jobId, message: "You have already applied for this job." },
      ]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCustomMessage("");
    setSelectedJobId(null);
  };

  const handleApply = (jobId) => {
    const hasAlreadyApplied = applicationMessages.some((msg) => msg.jobId === jobId);

    if (!hasAlreadyApplied) {
      if (!appliedJobIds.includes(jobId)) {
        openModal(jobId);
      } else {
        setApplicationMessages((prevMessages) => [
          ...prevMessages,
          { jobId, message: "You have already applied for this job." },
        ]);
      }
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
      const applicationData = {
        coverLetter: "Sample cover letter",
        messageToClient: customMessage,
      };

      UserService.applyForJob(jobId, applicationData)
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
              { jobId, message: "An error occurred while submitting the job application." },
            ]);
          }
          closeModal();
        });
    }
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

              {appliedJobIds.includes(job.id) ? (
                <p>You have already applied for this job.</p>
              ) : (
                <div>
                  <button onClick={() => handleApply(job.id)}>Apply</button>
                  <hr />
                  {applicationMessages.map(
                    (msg) => msg.jobId === job.id && <p key={msg.jobId}>{msg.message}</p>
                  )}
                  <Modal
                    isOpen={isModalOpen && selectedJobId === job.id}
                    onRequestClose={closeModal}
                    contentLabel="Custom Message Modal"
                  >
                    <h2>Enter Your Custom Message</h2>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                    />
                    <button onClick={handleApplyWithCustomMessage}>Apply</button>
                    <button onClick={closeModal}>Cancel</button>
                  </Modal>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllJobs;
