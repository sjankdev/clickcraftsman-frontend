import axios from "axios";
import authHeader from "../security/auth-header";

const API_URL_JOB = "http://localhost:8080/api/job";


const applyForJob = async (jobId, applicationData) => {
    const url = `${API_URL_JOB}/apply/${jobId}`;
  
    try {
        const response = await axios
            .post(url, applicationData, { headers: authHeader() });
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
          const response = await axios
              .get(url, { headers: authHeader() });
          console.log("getAppliedJobs method, freelancer");
          return response.data;
      } catch (error) {
          console.error("Error fetching applied jobs", error);
          throw error;
      }
  };

  const getApplicationStatus = async (jobId) => {
    const url = `${API_URL_JOB}/application-status/${jobId}`;
  
    try {
      const response = await axios.get(url, { headers: authHeader() });
      console.log("getApplicationStatus method, freelancer");
      return response.data;
    } catch (error) {
      console.error("Error fetching application status", error);
      throw error;
    }
  };
  
  const freelancerService = {
    applyForJob,
    getAppliedJobs,
    getApplicationStatus,
  };
  
  export default freelancerService;