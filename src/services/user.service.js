import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";
const API_URL_JOB_APPLY = "http://localhost:8080/api/job-applications";

const API_URL_JOB_POST = "http://localhost:8080/api/job-postings";

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
  return axios.get(API_URL + "client-received-applications", { headers: authHeader() });
};

const getClientPostedJobsBoard = () => {
  return axios.get(API_URL + "client-projects", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const applyForJob = (jobId, applicationData) => {
  const url = `${API_URL_JOB_APPLY}/apply/${jobId}`;

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

const getAppliedJobs = () => {
  const url = `${API_URL_JOB_APPLY}/applied-jobs`;

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
  const url = `${API_URL_JOB_APPLY}/client-job-applications`;

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
  const url = `${API_URL_JOB_POST}/client-job-postings`;

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
};

export default userService;
