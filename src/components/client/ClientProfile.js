import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../services/security/auth-header";
import useApiData from "../../services/utils/useApiData";

const ClientProfile = () => {
  const locations = useApiData(
    "http://localhost:8080/api/utils/getAllLocations"
  );

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

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/client/profile",
          {
            headers: authHeader(),
          }
        );
        console.log("Received client profile data:", response.data);

        setUserData(response.data);
        setUpdateFormData(response.data);
      } catch (error) {
        console.error("Error fetching client data:", error);
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

      const response = await axios.get("http://localhost:8080/api/client/profile", {
        headers: authHeader(),
      });

      console.log("Received updated client profile data:", response.data);
      setUserData(response.data);
    } catch (error) {
      console.error("Error updating client data:", error);
    }
  };

  return (
    <div>
      <h2>Client Profile</h2>
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
          <p>
            <strong>Contact Phone:</strong> {userData.contactPhone}
          </p>
          <p>
            <strong>Location:</strong> {userData.location}
          </p>
          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;
