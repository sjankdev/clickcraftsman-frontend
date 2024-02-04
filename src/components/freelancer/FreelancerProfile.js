import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../services/security/auth-header";
import useApiData from "../../services/utils/useApiData";

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
    <div>
      <h2>Freelancer Profile</h2>
      {isEditing ? (
        <div>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={updateFormData.firstName}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={updateFormData.lastName}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Contact Phone:
            <input
              type="text"
              name="contactPhone"
              value={updateFormData.contactPhone}
              onChange={handleInputChange}
            />
          </label>
          <br />
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
          <br />
          <label>
            Portfolio:
            <input
              type="text"
              name="portfolio"
              value={updateFormData.portfolio}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Years of Experience:
            <input
              type="number"
              name="yearsOfExperience"
              value={updateFormData.yearsOfExperience}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label htmlFor="skills">Select Skills:</label>
          <select
            name="skills"
            multiple
            className="form-control"
            value={updateFormData.skills}
            onChange={handleInputChange}
          >
            {skills.map((skill) => (
              <option key={skill.id || skill.skillName} value={skill.skillName}>
                {skill.skillName}
              </option>
            ))}
          </select>
          <br />
          <button onClick={handleUpdateClick}>Update</button>
        </div>
      ) : (
        <div>
          {profilePictureData && (
            <div className="profile-picture">
              <img
                src={`data:image/png;base64,${profilePictureData}`}
                alt="Profile"
              />
            </div>
          )}
          <p>
            <strong>First Name:</strong> {userData.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {userData.lastName}
          </p>
          <p>
            <strong>Contact Phone:</strong> {userData.contactPhone}
          </p>
          <p>
            <strong>Location:</strong> {userData.location}
          </p>
          <p>
            <strong>Portfolio:</strong> {userData.portfolio}
          </p>
          <p>
            <strong>Years of Experience:</strong> {userData.yearsOfExperience}
          </p>
          <p>
            <strong>Skills:</strong> {userData.skills.join(", ")}
          </p>

          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default FreelancerProfile;
