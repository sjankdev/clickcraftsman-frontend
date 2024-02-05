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

const postJob = async (userEmail, jobPostingData) => {
  const url = `${API_URL_JOB}/post`;

  try {
    const response = await axios.post(url, { userEmail, ...jobPostingData }, { headers: authHeader() });
    console.log("postJob method, client");
    return response.data;
  } catch (error) {
    console.error("Error posting job", error);
    throw error;
  }
};

const sendOffer = async (applicationId, offerDetails) => {
  const url = `${API_URL_JOB}/send-offer/${applicationId}`;

  try {
    const response = await axios.post(url, offerDetails, { headers: authHeader() });
    console.log("sendOffer method, client");
    return response.data;
  } catch (error) {
    console.error(`Error sending offer for applicationId ${applicationId}`, error);
    throw error;
  }
};


const clientService = {
  getClientJobPostings,
  getClientJobApplications,
  getJobApplicationsForJob,
  getPublicProfiles,
  postJob,
  sendOffer, 
};

export default clientService;