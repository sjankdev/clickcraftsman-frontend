import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = (
  email,
  password,
  role,
  firstName,
  lastName,
  contactPhone,
  location,
  skills,
  portfolio,
  yearsOfExperience,
  profilePicture 
) => {
  const signUpRequestJson = JSON.stringify({
    email,
    password,
    role,
    firstName,
    lastName,
    contactPhone,
    location,
    skills,
    portfolio,
    yearsOfExperience,
  });

  const signUpRequestBlob = new Blob([signUpRequestJson], {
    type: 'application/json',
  });

  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('role', role);
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('contactPhone', contactPhone);
  formData.append('location', location);
  formData.append('skills', JSON.stringify(skills)); 
  formData.append('portfolio', portfolio);
  formData.append('yearsOfExperience', yearsOfExperience);
  formData.append('profilePicture', profilePicture); 
  formData.append('signUpRequest', signUpRequestBlob); 

  return axios.post(API_URL + "signup", formData, {
    headers: {
      'Content-Type': 'multipart/form-data', 
    },
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
