import axios from "axios";
import authHeader from "../security/auth-header";

const API_URL_JOB = "https://clickcraftsman-backend-latest.onrender.com/api/job";
const API_URL_CLIENT = "https://clickcraftsman-backend-latest.onrender.com/api/client";

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
  const url = `https://clickcraftsman-backend-latest.onrender.com/api/freelancer/${freelancerId}`;

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

const archiveJobPosting = async (jobId) => {
  const url = `${API_URL_JOB}/archive/${jobId}`;

  try {
    const response = await axios.put(url, null, { headers: authHeader() });
    console.log("Job posting archived successfully!", response);
    return response.data;
  } catch (error) {
    console.error(`Error archiving job posting ${jobId}`, error);
    throw error;
  }
};

const unarchiveJobPosting = async (jobId) => {
  const url = `${API_URL_JOB}/unarchive/${jobId}`;

  try {
    const response = await axios.put(url, null, { headers: authHeader() });
    console.log("Job posting unarchived successfully!", response);
    return response.data;
  } catch (error) {
    console.error(`Error unarchiving job posting ${jobId}`, error);
    throw error;
  }
};

const getLiveClientJobPostingsCount = async () => {
  const url = `${API_URL_CLIENT}/client-job-postings/live-count`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    console.log("getLiveClientJobPostingsCount method, client");
    return response.data;
  } catch (error) {
    console.error("Error fetching live client job postings count", error);
    throw error;
  }
};

const getArchivedClientJobPostingsCount = async () => {
  const url = `${API_URL_CLIENT}/client-job-postings/archived-count`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    console.log("getArchivedClientJobPostingsCount method, client");
    return response.data;
  } catch (error) {
    console.error("Error fetching archived client job postings count", error);
    throw error;
  }
};

const getClientJobPostingCount = async (jobId) => {
  const url = `${API_URL_JOB}/job-applications/${jobId}`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    console.log("getClientJobPostingCount method, client");
    return response.data.length; 
  } catch (error) {
    console.error(`Error fetching job applications for job ${jobId}`, error);
    throw error;
  }
};

const getJobDetails = async (jobId) => {
  const url = `${API_URL_JOB}/details/${jobId}`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    console.log("getJobDetails method, client");
    return response.data;
  } catch (error) {
    console.error(`Error fetching job details for job ${jobId}`, error);
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
  deleteJobPosting,
  archiveJobPosting,
  unarchiveJobPosting,
  getLiveClientJobPostingsCount,
  getArchivedClientJobPostingsCount,
  getClientJobPostingCount,
  getJobDetails,
};

export default clientService;
