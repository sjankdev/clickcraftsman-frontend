import axios from "axios";
import authHeader from "../security/auth-header";

const API_URL_JOB = "http://localhost:8080/api/job";

const getClientJobPostings = async () => {
  const url = `${API_URL_JOB}/client-job-postings`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    console.log("getClientJobPostings method, client");
    return response.data;
  } catch (error) {
    console.error("Error fetching client job postings", error);
    throw error;
  }
};

const getClientJobApplications = async () => {
  const url = `${API_URL_JOB}/client-received-applications`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    console.log("getClientJobApplications method, client");
    return response.data;
  } catch (error) {
    console.error("Error fetching client job applications", error);
    throw error;
  }
};

const getJobApplicationsForJob = async (jobId) => {
  const url = `${API_URL_JOB}/job-applications/${jobId}`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    console.log("getJobApplicationsForJob method, client");
    return response.data;
  } catch (error) {
    console.error(`Error fetching job applications for job ${jobId}`, error);
    throw error;
  }
};

const getPublicProfiles = async (freelancerId) => {
  const url = `http://localhost:8080/api/freelancer/${freelancerId}`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    console.log("getPublicProfile method, client");
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching public profile for freelancer ${freelancerId}`,
      error
    );
    throw error;
  }
};

const clientService = {
  getClientJobPostings,
  getClientJobApplications,
  getJobApplicationsForJob,
  getPublicProfiles,
};

export default clientService;
