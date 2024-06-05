import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../services/security/auth-header";
import useApiData from "../../services/utils/useApiData";
import "../../assets/css/clientProfile.css";
import ClientService from "../../services/client/client-service";
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { AiOutlineGlobal, AiFillLinkedin, AiFillInstagram, AiOutlineBank, AiOutlineTeam, AiOutlineFieldTime, AiFillEdit } from 'react-icons/ai';
import validationSchemaUpdate from "../../services/utils/validationSchemasUpdate";

const ClientProfile = () => {
  const locations = useApiData(
    "http://localhost:8080/api/utils/getAllLocations"
  );

  const [profilePictureData, setProfilePictureData] = useState(null);
  const [liveJobPostingCount, setLiveJobPostingCount] = useState(0);
  const [archivedJobPostingCount, setArchivedJobPostingCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    contactPhone: "",
    location: "",
    companyName: "",
    companySize: "",
    companyIndustry: "",
    companyLocation: "",
    website: "",
    linkedin: "",
    instagram: "",
  });
  const [updateFormData, setUpdateFormData] = useState({
    firstName: "",
    lastName: "",
    contactPhone: "",
    location: "",
    companyName: "",
    companySize: "",
    companyIndustry: "",
    companyLocation: "",
    website: "",
    linkedin: "",
    instagram: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobPostingCounts = async () => {
      try {
        const liveResponse = await ClientService.getLiveClientJobPostingsCount();
        const archivedResponse = await ClientService.getArchivedClientJobPostingsCount();

        setLiveJobPostingCount(liveResponse);
        setArchivedJobPostingCount(archivedResponse);
      } catch (error) {
        console.error("Error fetching job posting counts:", error);
      }
    };

    fetchJobPostingCounts();
  }, []);

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
    try {
      const updatedFormData = { ...updateFormData, [name]: value };
      validationSchemaUpdate.validateSyncAt(name, updatedFormData);
      setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (error) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error.message,
      }));
    }
  };

  const handleUpdateClick = async () => {
    try {
      validationSchemaUpdate.validateSync(updateFormData, { abortEarly: false });

      const { firstName, lastName, contactPhone, location, companyName, companySize, companyIndustry, companyLocation, website, linkedin, instagram } = updateFormData;

      console.log("Updating client data...");
      console.log("Data to be sent:", { firstName, lastName, contactPhone, location, companyName, companySize, companyIndustry, companyLocation, website, linkedin, instagram });

      await axios.post(
        "http://localhost:8080/api/client/update",
        { firstName, lastName, contactPhone, location, companyName, companySize, companyIndustry, companyLocation, website, linkedin, instagram },
        {
          headers: authHeader(),
        }
      );

      console.log("Client data updated successfully!");

      setIsEditing(false);
      const response = await axios.get(
        "http://localhost:8080/api/client/profile",
        {
          headers: authHeader(),
        }
      );
      setUserData(response.data);
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = {};
        error.inner.forEach(err => {
          errors[err.path] = err.message;
        });
        setValidationErrors(errors);
      } else {
        console.error("Error updating client data:", error);
      }
    }
  };


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="client-profile-container-clientee1">
      <div className="image-and-profile-info-clientee1">
        {profilePictureData && (
          <img
            src={`data:image/png;base64,${profilePictureData}`}
            alt="Profile"
            className="profile-image-clientee1"
          />
        )}
        <div className="profile-data-clientee1">
          <div className="name-clientee1">
            <div className="name-text-clientee1">
              {userData.firstName} {userData.lastName}
            </div>
          </div>
          <div className="contact-info-clientee1">
            <span className="icon-clientee1"><FaMapMarkerAlt /></span>
            <span className="location-clientee1">{userData.location}</span>
            <span className="icon-clientee1"><FaPhone /></span>
            <span className="contact-phone-clientee1">{userData.contactPhone}</span>
          </div>
          <div className="social-links-clientee1">
            <div><AiOutlineGlobal /> Website: {userData.website}</div>
            <div><AiFillLinkedin /> Linkedin: {userData.linkedin}</div>
            <div><AiFillInstagram /> Instagram: {userData.instagram}</div>
          </div>
        </div>
      </div>
      <hr className="line-clientee1" />
      <div className="company-and-jobs-info-clientee1">
        <div className="company-info-clientee1">
          <p>Company Info</p>
          <p><AiOutlineBank /> {userData.companyName}</p>
          <p><FaMapMarkerAlt /> {userData.companyLocation}</p>
          <p><AiOutlineTeam /> {userData.companySize}</p>
          <p><AiOutlineFieldTime /> {userData.companyIndustry}</p>
        </div>
        <div className="jobs-info-clientee1">
          <p>Jobs Info</p>
          <p><strong>Live job posting:</strong> {liveJobPostingCount}</p>
          <p><strong>Archived job posting:</strong> {archivedJobPostingCount}</p>
        </div>
      </div>
      <button type="button" className="update-button-clientee1" onClick={handleEditClick}>
        <AiFillEdit /> Edit Profile
      </button>
      {isEditing && (
        <form className="edit-form-clientee1">
          <div className="form-group-clientee1">
            <label htmlFor="firstName">First Name:</label>
            <input
              className="input-field"
              type="text"
              id="firstName"
              name="firstName"
              value={updateFormData.firstName}
              onChange={handleInputChange}
            />
            {validationErrors.firstName && (
              <div className="error-message">{validationErrors.firstName}</div>
            )}
          </div>
          <div className="form-group-clientee1">
            <label htmlFor="lastName">Last Name:</label>
            <input
              className="input-field"
              type="text"
              id="lastName"
              name="lastName"
              value={updateFormData.lastName}
              onChange={handleInputChange}
            />
            {validationErrors.lastName && (
              <div className="error-message">{validationErrors.lastName}</div>
            )}
          </div>
          <div className="form-group-clientee1">
            <label htmlFor="contactPhone">Contact Phone:</label>
            <input
              className="input-field"
              type="text"
              id="contactPhone"
              name="contactPhone"
              value={updateFormData.contactPhone}
              onChange={handleInputChange}
            />
            {validationErrors.contactPhone && (
              <div className="error-message">{validationErrors.contactPhone}</div>
            )}
          </div>
          <div className="form-group-clientee1">
            <label htmlFor="location">Location:</label>
            <select
              className="input-field"
              id="location"
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
            {validationErrors.location && (
              <div className="error-message">{validationErrors.location}</div>
            )}
          </div>
          <div className="form-group-clientee1">
            <label htmlFor="companyName">Company Name:</label>
            <input
              className="input-field"
              type="text"
              id="companyName"
              name="companyName"
              value={updateFormData.companyName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group-clientee1">
            <label htmlFor="companyIndustry">Company Industry:</label>
            <input
              className="input-field"
              type="text"
              id="companyIndustry"
              name="companyIndustry"
              value={updateFormData.companyIndustry}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group-clientee1">
            <label htmlFor="companySize">Company Size:</label>
            <input
              className="input-field"
              type="text"
              id="companySize"
              name="companySize"
              value={updateFormData.companySize}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group-clientee1">
            <label htmlFor="companyLocation">Company location:</label>
            <input
              className="input-field"
              type="text"
              id="companyLocation"
              name="companyLocation"
              value={updateFormData.companyLocation}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group-clientee1">
            <label htmlFor="website">Website:</label>
            <input
              className="input-field"
              type="text"
              id="website"
              name="website"
              value={updateFormData.website}
              onChange={handleInputChange}
            />
            {validationErrors.website && (
              <div className="error-message">{validationErrors.website}</div>
            )}
          </div>
          <div className="form-group-clientee1">
            <label htmlFor="instagram">Instagram:</label>
            <input
              className="input-field"
              type="text"
              id="instagram"
              name="instagram"
              value={updateFormData.instagram}
              onChange={handleInputChange}
            />
            {validationErrors.instagram && (
              <div className="error-message">{validationErrors.instagram}</div>
            )}
          </div>
          <div className="form-group-clientee1">
            <label htmlFor="linkedin">Linkedin:</label>
            <input
              className="input-field"
              type="text"
              id="linkedin"
              name="linkedin"
              value={updateFormData.linkedin}
              onChange={handleInputChange}
            />
            {validationErrors.linkedin && (
              <div className="error-message">{validationErrors.linkedin}</div>
            )}
          </div>
          <button type="button" className="update-button-clientee1" onClick={handleUpdateClick}>
            Update
          </button>
        </form>
      )}
    </div>
  );
}

export default ClientProfile;
