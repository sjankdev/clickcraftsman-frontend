import axios from "axios";
import authHeader from "../security/auth-header";

const API_URL = "https://clickcraftsman-frontend.vercel.app/api/test/";
const API_URL_JOB = "https://clickcraftsman-frontend.vercel.app/api/job";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "client", { headers: authHeader() });
};

const getFreelancerBoard = () => {
  return axios.get(API_URL + "freelancer", { headers: authHeader() });
};

const getFreelancerOpenProjects = () => {
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


const userService = {
  getPublicContent,
  getUserBoard,
  getAdminBoard,
  getFreelancerBoard,
  getFreelancerOpenProjects,
  getClientReceivedApplicationsBoard,
  getClientPostedJobsBoard,
};

export default userService;
