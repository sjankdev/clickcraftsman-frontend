import axios from "axios";
import authHeader from "../security/auth-header";

const API_URL_JOB = "http://localhost:8080/api/job";
const API_URL_CLIENT = "http://localhost:8080/api/client";

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
    const response = await axios.post(
      url,
      { userEmail, ...jobPostingData },
      { headers: authHeader() }
    );
    console.log("postJob method, client");
    return response.data;
  } catch (error) {
    console.error("Error posting job", error);
    throw error;
  }
};

const sendOffer = async (applicationId, offerMessage) => {
  const url = `${API_URL_CLIENT}/send-offer/${applicationId}`;
  const offerDetails = { messageToFreelancer: offerMessage };

  try {
    const response = await axios.post(url, offerDetails, {
      headers: authHeader(),
    });
    console.log("Offer sent successfully!", response);
    return response.data;
  } catch (error) {
    console.error(
      `Error sending offer for applicationId ${applicationId}`,
      error
    );
    throw error;
  }
};

const declineApplication = async (applicationId) => {
  const url = `${API_URL_JOB}/decline-application/${applicationId}`;

  try {
    const response = await axios.post(url, null, { headers: authHeader() });
    console.log("Application declined successfully!", response);
    return response.data;
  } catch (error) {
    console.error(`Error declining application ${applicationId}`, error);
    throw error;
  }
};

const getClientJobPostingsCount = async () => {
  const url = `${API_URL_CLIENT}/client-job-postings/count`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    console.log("getClientJobPostingsCount method, client");
    return response.data;
  } catch (error) {
    console.error("Error fetching client job postings count", error);
    throw error;
  }
};

const deleteJobPosting = async (jobId) => {
  const url = `${API_URL_JOB}/delete/${jobId}`;
  
  try {
    const response = await axios.delete(url, { headers: authHeader() });
    console.log("Job posting deleted successfully!", response);
    return response.data;
  } catch (error) {
    console.error(`Error deleting job posting ${jobId}`, error);
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
  declineApplication,
  getClientJobPostingsCount,
  deleteJobPosting, 
};

export default clientService;
