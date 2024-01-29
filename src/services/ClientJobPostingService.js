import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080";

class ClientJobPostingService {
  postJob(userEmail, jobPostingData) {
    return axios.post(
      `${API_URL}/api/job/post`,
      { userEmail, ...jobPostingData },
      { headers: authHeader() }
    );
  }
}

export default new ClientJobPostingService();
