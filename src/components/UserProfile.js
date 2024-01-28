import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../services/auth-header";
import useApiData from "../services/useApiData";

const UserProfile = () => {
  const locations = useApiData(
    "http://localhost:8080/api/locations/getAllLocations"
  );
  const skills = useApiData("http://localhost:8080/api/skills/getAllSkills");
  const skillsArray = Array.isArray(skills) ? skills : [skills];

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
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/user/profile",
          {
            headers: authHeader(),
          }
        );
        console.log("Received user profile data:", response.data);

        const userDataWithSkills = {
          ...response.data,
          skills: response.data.skills || skillsArray,
        };

        setUserData(userDataWithSkills);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [skillsArray]);

  const handleEditClick = () => {
    setUpdateFormData({
      ...userData,
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value, options } = e.target;

    const isMultiSelect = options && options.length > 1;

    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: isMultiSelect ? getSelectedOptions(options) : value,
    }));
  };

  const getSelectedOptions = (options) => {
    return Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
  };

  const handleUpdateClick = async () => {
    try {
      const updatedData = {
        ...updateFormData,
        skills: Array.isArray(updateFormData.skills)
          ? updateFormData.skills
          : [updateFormData.skills],
      };

      await axios.post("http://localhost:8080/api/user/update", updatedData, {
        headers: authHeader(),
      });

      setIsEditing(false);

      const response = await axios.get(
        "http:  localhost:8080/api/user/profile",
        {
          headers: authHeader(),
        }
      );

      console.log("Received updated user profile data:", response.data);
      setUserData(response.data);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const userRoles = authHeader().roles || [];

  return (
    <div>
      <h2>User Profile</h2>
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
          {userRoles.includes("ROLE_CLIENT") && (
            <>
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
            </>
          )}
          {userRoles.includes("ROLE_FREELANCER") && (
            <>
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
            </>
          )}
          <br />
          <button onClick={handleUpdateClick}>Update</button>
        </div>
      ) : (
        <div>
          <p>
            <strong>First Name:</strong> {userData.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {userData.lastName}
          </p>
          {userRoles.includes("ROLE_CLIENT") && (
            <>
              <p>
                <strong>Contact Phone:</strong> {userData.contactPhone}
              </p>
              <p>
                <strong>Location:</strong> {userData.location}
              </p>
            </>
          )}
          {userRoles.includes("ROLE_FREELANCER") && (
            <>
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
                <strong>Years of Experience:</strong>{" "}
                {userData.yearsOfExperience}
              </p>
              <p>
                <strong>Skills:</strong> {userData.skills.join(", ")}
              </p>
            </>
          )}
          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
