import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../services/user.service";

const PublicProfileDetail = () => {
  const [profile, setProfile] = useState(null);
  const { freelancerId } = useParams();

  useEffect(() => {
    console.log("ID from params:", freelancerId);

    const isValidId = !isNaN(Number(freelancerId));

    if (isValidId) {
      UserService.getPublicProfile(freelancerId)
        .then((response) => setProfile(response))
        .catch((error) =>
          console.error("Error fetching public profile:", error)
        );
    } else {
      console.error("Invalid freelancerId:", freelancerId);
    }
  }, [freelancerId]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>
        {profile.firstName} {profile.lastName}'s Profile
      </h1>
      <p>Contact: {profile.contactPhone}</p>
      <p>Location: {profile.location}</p>
      <p>Portfolio: {profile.portfolio}</p>
      <p>Years of Experience: {profile.yearsOfExperience}</p>
      <p>Skills: {profile.skills.join(", ")}</p>
    </div>
  );
};

export default PublicProfileDetail;
