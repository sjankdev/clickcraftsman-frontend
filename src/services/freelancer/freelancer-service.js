import axios from "axios";
import authHeader from "../security/auth-header";

const API_URL_JOB = "https://clickcraftsman-backend-latest.onrender.com/api/job";
const API_URL_FREELANCER = "https://clickcraftsman-backend-latest.onrender.com/api/freelancer";

const applyForJob = async (jobId, applicationData) => {
  const url = `${API_URL_JOB}/apply/${jobId}`;

  try {
    const response = await axios.post(url, applicationData, {
      headers: authHeader(),
    });
    console.log("Job application submitted successfully");
    console.log("applyForJob method, freelancer");
    return response.data;
  } catch (error) {
    console.error("Error submitting job application", error);
    throw error;
  }
};

const getAppliedJobs = async () => {
  const url = `${API_URL_JOB}/applied-jobs`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    console.log("getAppliedJobs method, freelancer");
    return response.data;
  } catch (error) {
    console.error("Error fetching applied jobs", error);
    throw error;
  }
};

const searchJobs = async (filterParams) => {
  const url = `${API_URL_JOB}/searchJobs`;

  try {
    const response = await axios.get(url, {
      params: filterParams,
      headers: authHeader(),
    });
    console.log("searchJobs method, freelancer");
    return response.data;
  } catch (error) {
    console.error("Error fetching job search results", error);
    throw error;
  }
};

const freelancerService = {
  applyForJob,
  getAppliedJobs,
  searchJobs,
};

export default freelancerService;
