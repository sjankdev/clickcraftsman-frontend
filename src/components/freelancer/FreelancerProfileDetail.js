import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClientService from "../../services/client/client-service";
import "../../assets/css/freelancerPublicProfileDetail.css";
import {
  AiOutlinePhone,
  AiOutlineRobot,
  AiOutlineEnvironment,
  AiOutlineLink,
  AiOutlineClockCircle,
  AiOutlineTool,
} from "react-icons/ai";
const FreelancerProfileDetail = () => {
  const [profile, setProfile] = useState(null);
  const { freelancerId } = useParams();

  useEffect(() => {
    const isValidId = !isNaN(Number(freelancerId));

    if (isValidId) {
      ClientService.getPublicProfiles(freelancerId)
        .then((response) => {
          setProfile(response);
        })
        .catch((error) =>
          console.error("Error fetching public profile:", error)
        );
    } else {
      console.error("Invalid freelancerId:", freelancerId);
    }
  }, [freelancerId]);

  if (!profile) {
    return (
      <div className="public-profile-detail-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="public-profile-detail-container">
      <h1 className="profile-header">
        {profile.firstName} {profile.lastName}'s Profile
      </h1>
      <img
        src={`data:image/jpeg;base64,${profile.profilePictureData}`}
        alt={`${profile.firstName} ${profile.lastName}'s Profile Picture`}
        className="profile-picture-details"
      />
      <p className="profile-info-details">
        <AiOutlineRobot /> {profile.aboutFreelancer}
      </p>
      <p className="profile-info-details">
        <AiOutlineEnvironment /> {profile.location}
      </p>
      <p className="profile-info-details">
        <AiOutlinePhone /> {profile.contactPhone}
      </p>
      <p className="profile-info-details">
        <AiOutlineTool /> {profile.skills.join(", ")}
      </p>
      <p className="profile-info-details">
        <AiOutlineClockCircle /> {profile.yearsOfExperience}
      </p>
      <p className="profile-info-details">
        <AiOutlineLink /> {profile.portfolio}
      </p>
    </div>
  );
};

export default FreelancerProfileDetail;
