import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../services/security/auth-header";
import useApiData from "../../services/utils/useApiData";
import "../../assets/css/clientProfile.css";
import ClientService from "../../services/client/client-service";
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { AiOutlineGlobal, AiFillLinkedin, AiFillInstagram, AiOutlineBank, AiOutlineTeam, AiOutlineFieldTime } from 'react-icons/ai';

const ClientProfile = () => {
  const locations = useApiData(
    "http://localhost:8080/api/utils/getAllLocations"
  );

  const [profilePictureData, setProfilePictureData] = useState(null);
  const [liveJobPostingCount, setLiveJobPostingCount] = useState(0);
  const [archivedJobPostingCount, setArchivedJobPostingCount] = useState(0);
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
  };

  const handleUpdateClick = async () => {
    try {
      const { firstName, lastName, contactPhone, location, companyName, companySize, companyIndustry, companyLocation, website, linkedin, instagram } = updateFormData;
      await axios.post(
        "http://localhost:8080/api/client/update",
        { firstName, lastName, contactPhone, location, companyName, companySize, companyIndustry, companyLocation, website, linkedin, instagram },
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
    <div className="client-profile-container">
      <div className="image-and-profile-info">
        {profilePictureData && (
          <img
            src={`data:image/png;base64,${profilePictureData}`}
            alt="Profile"
            className="profile-image"
          />
        )}
        <div className="profile-data">
          <div className="name">
            <div className="name-text">
              {userData.firstName} {userData.lastName}
            </div>
          </div>
          <div className="contact-info">
            <span className="icon"><FaMapMarkerAlt /></span>
            <span className="location">{userData.location}</span>
            <span className="icon"><FaPhone /></span>
            <span className="contact-phone">{userData.contactPhone}</span>
          </div>
          <div className="social-links">
            <div><AiOutlineGlobal /> Website: {userData.website}</div>
            <div><AiFillLinkedin /> Linkedin: {userData.linkedin}</div>
            <div><AiFillInstagram /> Instagram: {userData.instagram}</div>
          </div>
        </div>
      </div>
      <hr className="line" />
      <div className="company-and-jobs-info">
        <div className="company-info">
          <p>Company Info</p>
          <p><AiOutlineBank /> {userData.companyName}</p>
          <p><FaMapMarkerAlt /> {userData.companyLocation}</p>
          <p><AiOutlineTeam /> {userData.companySize}</p>
          <p><AiOutlineFieldTime /> {userData.companyIndustry}</p>
        </div>
        <div className="jobs-info">
          <p>Jobs Info</p>
          <p><strong>Live job posting:</strong> {liveJobPostingCount}</p>
          <p><strong>Archived job posting:</strong> {archivedJobPostingCount}</p>
        </div>
      </div>  
    </div>
  );
}

export default ClientProfile;
