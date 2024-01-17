import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";
const API_URL_JOB_APPLY = "http://localhost:8080/api/job-applications";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "client", { headers: authHeader() });
};

const getFreelancerBoard = () => {
  return axios.get(API_URL + "freelancer", { headers: authHeader() });
};

const getAllJobsBoard = () => {
  return axios.get(API_URL + "all-jobs", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const applyForJob = (jobId, applicationData) => {
  const url = `${API_URL_JOB_APPLY}/apply/${jobId}`;

  return axios.post(url, applicationData, { headers: authHeader() })
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

  return axios.get(url, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching applied jobs", error);
      throw error;
    });
};


const userService = {
  getPublicContent,
  getUserBoard,
  getAdminBoard,
  getFreelancerBoard,
  getAllJobsBoard,
  applyForJob,
  getAppliedJobs,
};

export default userService;