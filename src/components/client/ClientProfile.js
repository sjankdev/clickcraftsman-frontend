import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../services/security/auth-header";
import useApiData from "../../services/utils/useApiData";
import "../../assets/css/clientProfile.css";

const ClientProfile = () => {
  const locations = useApiData(
    "http://localhost:8080/api/utils/getAllLocations"
  );
  const [profilePictureData, setProfilePictureData] = useState(null);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    contactPhone: "",
    location: "",
  });

  const [updateFormData, setUpdateFormData] = useState({
    firstName: "",
    lastName: "",
    contactPhone: "",
    location: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/client/profile",
          {
            headers: authHeader(),
          }
        );

        console.log("Response from server:", response.data);

        if (response.data.profilePictureData) {
          console.log(
            "Profile picture data found:",
            response.data.profilePictureData
          );
          setProfilePictureData(response.data.profilePictureData);
        } else {
          console.log("Profile picture data not found in the response.");
        }

        setUserData(response.data);
        setUpdateFormData(response.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching client data:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateClick = async () => {
    try {
      const { firstName, lastName, contactPhone, location } = updateFormData;
      await axios.post(
        "http://localhost:8080/api/client/update",
        { firstName, lastName, contactPhone, location },
        {
          headers: authHeader(),
        }
      );
      setIsEditing(false);
      const response = await axios.get(
        "http://localhost:8080/api/client/profile",
        {
          headers: authHeader(),
        }
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error updating client data:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="client-profile">
      <div className="profile-header">
        <h2>Client Profile</h2>
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
          <button onClick={handleUpdateClick}>Update</button>
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-info">
            {profilePictureData && (
              <div className="profile-picture">
                <img
                  src={`data:image/png;base64,${profilePictureData}`}
                  alt="Profile"
                />
              </div>
            )}
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
          </div>
          <button className="edit-btn" onClick={handleEditClick}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;
