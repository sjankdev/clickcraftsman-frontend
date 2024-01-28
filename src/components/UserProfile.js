import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../services/auth-header";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
  });

  const [updateFormData, setUpdateFormData] = useState({
    firstName: "",
    lastName: "",
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
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setUpdateFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setUpdateFormData({
      ...updateFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateClick = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/user/update",
        updateFormData,
        {
          headers: authHeader(),
        }
      );

      setIsEditing(false);

      const response = await axios.get(
        "http://localhost:8080/api/user/profile",
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

  console.log("Current user data:", userData);
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
          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
