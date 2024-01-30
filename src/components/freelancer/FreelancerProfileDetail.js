import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClientService from "../../services/client/client-service";
import "../../assets/css/freelancerPublicProfileDetail.css";

const FreelancerProfileDetail = () => {
  const [profile, setProfile] = useState(null);
  const { freelancerId } = useParams();

  useEffect(() => {
    console.log('ID from params:', freelancerId);

    const isValidId = !isNaN(Number(freelancerId));

    if (isValidId) {
      ClientService.getPublicProfiles(freelancerId)
        .then((response) => {
          console.log('Profile details:', response);
          setProfile(response);
        })
        .catch((error) => console.error('Error fetching public profile:', error));
    } else {
      console.error('Invalid freelancerId:', freelancerId);
    }
  }, [freelancerId]);

  if (!profile) {
    return <div className="public-profile-detail-container"><div className="loading-text">Loading...</div></div>;
  }

  return (
    <div className="public-profile-detail-container">
      <h1 className="profile-header">{profile.firstName} {profile.lastName}'s Profile</h1>
      <p className="profile-info">Contact: {profile.contactPhone}</p>
      <p className="profile-info">Location: {profile.location}</p>
      <p className="profile-info">Portfolio: {profile.portfolio}</p>
      <p className="profile-info">Years of Experience: {profile.yearsOfExperience}</p>
      <p className="profile-info">Skills: {profile.skills.join(", ")}</p>
    </div>
  );
};

export default FreelancerProfileDetail;
