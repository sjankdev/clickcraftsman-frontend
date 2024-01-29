import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";
const API_URL_JOB = "http://localhost:8080/api/job";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "client", { headers: authHeader() });
};

const getFreelancerBoard = () => {
  return axios.get(API_URL + "freelancer", { headers: authHeader() });
};

const getOpenProjectsForFreelancersBoard = () => {
  return axios.get(API_URL + "projects", { headers: authHeader() });
};

const getClientReceivedApplicationsBoard = () => {
  return axios.get(API_URL + "client-received-applications", {
    headers: authHeader(),
  });
};

const getClientPostedJobsBoard = () => {
  return axios.get(API_URL + "client-projects", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const applyForJob = (jobId, applicationData) => {
  const url = `${API_URL_JOB}/apply/${jobId}`;

  return axios
    .post(url, applicationData, { headers: authHeader() })
    .then((response) => {
      console.log("Job application submitted successfully");
      return response.data;
    })
    .catch((error) => {
      console.error("Error submitting job application", error);
      throw error;
    });
};

const getPublicProfile = (freelancerId) => {
  const url = `http://localhost:8080/api/freelancer/${freelancerId}`;

  return axios
    .get(url, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(
        `Error fetching public profile for freelancer ${freelancerId}`,
        error
      );
      throw error;
    });
};

const getJobApplicationsForJob = (jobId) => {
  const url = `${API_URL_JOB}/job-applications/${jobId}`;

  return axios
    .get(url, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(`Error fetching job applications for job ${jobId}`, error);
      throw error;
    });
};

const getAppliedJobs = () => {
  const url = `${API_URL_JOB}/applied-jobs`;

  return axios
    .get(url, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching applied jobs", error);
      throw error;
    });
};

const getClientJobApplications = () => {
  const url = `${API_URL_JOB}/client-received-applications`;

  return axios
    .get(url, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching client job applications", error);
      throw error;
    });
};

const getClientJobPostings = () => {
  const url = `${API_URL_JOB}/client-job-postings`;

  return axios
    .get(url, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching client job postings", error);
      throw error;
    });
};

const userService = {
  getPublicContent,
  getUserBoard,
  getAdminBoard,
  getFreelancerBoard,
  getOpenProjectsForFreelancersBoard,
  applyForJob,
  getAppliedJobs,
  getClientReceivedApplicationsBoard,
  getClientJobPostings,
  getClientJobApplications,
  getClientPostedJobsBoard,
  getJobApplicationsForJob,
  getPublicProfile,
};

export default userService;
