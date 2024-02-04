import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../services/security/auth-header";
import useApiData from "../../services/utils/useApiData";
import "../../assets/css/freelancerProfile.css";

const FreelancerProfile = () => {
  const locations = useApiData(
    "http://localhost:8080/api/utils/getAllLocations"
  );
  const skills = useApiData("http://localhost:8080/api/utils/getAllSkills");
  const skillsArray = Array.isArray(skills) ? skills : [skills];

  const [profilePictureData, setProfilePictureData] = useState(null);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    contactPhone: "",
    location: "",
    portfolio: "",
    yearsOfExperience: 0,
    skills: skillsArray,
  });

  const [updateFormData, setUpdateFormData] = useState({
    firstName: "",
    lastName: "",
    contactPhone: "",
    location: "",
    portfolio: "",
    yearsOfExperience: 0,
    skills: skillsArray,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/freelancer/profile",
          {
            headers: authHeader(),
          }
        );

        console.log("Received freelancer profile data:", response.data);

        if (response.data.profilePictureData) {
          console.log(
            "Profile picture data found:",
            response.data.profilePictureData
          );
          setProfilePictureData(response.data.profilePictureData);
        } else {
          console.log("Profile picture data not found in the response.");
        }

        const freelancerDataWithLocation = {
          ...response.data,
          location: response.data.location || "",
        };

        setUserData(freelancerDataWithLocation);
        setUpdateFormData(freelancerDataWithLocation);
      } catch (error) {
        console.error("Error fetching freelancer data:", error);
      }
    };

    fetchFreelancerData();
  }, [skillsArray]);
  const handleInputChange = (e) => {
    const { name, value, options } = e.target;

    const isMultiSelect = options && options.length > 1;
    const inputValue = isMultiSelect ? getSelectedOptions(options) : value;

    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: name === "location" ? inputValue[0] : inputValue,
    }));
  };

  const getSelectedOptions = (options) => {
    return Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    try {
      const { firstName, lastName, contactPhone, location } = updateFormData;

      const freelancerFields = {
        portfolio: updateFormData.portfolio,
        yearsOfExperience: updateFormData.yearsOfExperience,
        skills: Array.isArray(updateFormData.skills)
          ? updateFormData.skills
          : [updateFormData.skills],
      };

      const updatedData = {
        ...freelancerFields,
        firstName,
        lastName,
        contactPhone,
        location,
      };

      await axios.post(
        "http://localhost:8080/api/freelancer/update",
        updatedData,
        {
          headers: authHeader(),
        }
      );

      setIsEditing(false);

      const response = await axios.get(
        "http://localhost:8080/api/freelancer/profile",
        {
          headers: authHeader(),
        }
      );

      console.log("Received updated freelancer profile data:", response.data);
      setUserData(response.data);
    } catch (error) {
      console.error("Error updating freelancer data:", error);
    }
  };

  return (
    <div className="freelancer-profile">
      <div className="profile-header">
        <h2>Freelancer Profile</h2>
      </div>
      {isEditing ? (
        <div>
          <div className="form-field">
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={updateFormData.firstName}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={updateFormData.lastName}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              Contact Phone:
              <input
                type="text"
                name="contactPhone"
                value={updateFormData.contactPhone}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              Location:
              <select
                name="location"
                value={updateFormData.location}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select Location
                </option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-field">
            <label>
              Portfolio:
              <input
                type="text"
                name="portfolio"
                value={updateFormData.portfolio}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              Years of Experience:
              <input
                type="number"
                name="yearsOfExperience"
                value={updateFormData.yearsOfExperience}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-field">
            <label htmlFor="skills">Select Skills:</label>
            <select
              name="skills"
              multiple
              className="form-control"
              value={updateFormData.skills}
              onChange={handleInputChange}
            >
              {skills.map((skill) => (
                <option
                  key={skill.id || skill.skillName}
                  value={skill.skillName}
                >
                  {skill.skillName}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleUpdateClick}>Update</button>
        </div>
      ) : (
        <div className="profile-card">
          {profilePictureData && (
            <div className="profile-picture">
              <img
                src={`data:image/png;base64,${profilePictureData}`}
                alt="Profile"
              />
            </div>
          )}
          <div className="profile-info">
            <div className="data-field">
              <div className="field-label">First Name:</div>
              <div className="field-value">{userData.firstName}</div>
            </div>
            <div className="data-field">
              <div className="field-label">Last Name:</div>
              <div className="field-value">{userData.lastName}</div>
            </div>
            <div className="data-field">
              <div className="field-label">Contact Phone:</div>
              <div className="field-value">{userData.contactPhone}</div>
            </div>
            <div className="data-field">
              <div className="field-label">Location:</div>
              <div className="field-value">{userData.location}</div>
            </div>
            <div className="data-field">
              <div className="field-label">Portfolio:</div>
              <div className="field-value">{userData.portfolio}</div>
            </div>
            <div className="data-field">
              <div className="field-label">Years of Experience:</div>
              <div className="field-value">{userData.yearsOfExperience}</div>
            </div>
            <div className="data-field">
              <div className="field-label">Skills:</div>
              <div className="field-value">{userData.skills.join(", ")}</div>
            </div>
          </div>
          <button className="edit-btn" onClick={handleEditClick}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default FreelancerProfile;
