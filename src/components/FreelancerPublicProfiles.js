import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const FreelancerPublicProfiles = () => {
  const [publicProfiles, setPublicProfiles] = useState([]);

  useEffect(() => {
    console.log("Fetching public profiles...");
    axios
      .get("http://localhost:8080/api/public-freelancers/getAllFreelancers")
      .then((response) => {
        console.log("Public profiles fetched successfully:", response.data);
        setPublicProfiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching public profiles:", error);
      });
  }, []);

  return (
    <div>
      <h1>Public Freelancer Profiles</h1>
      {publicProfiles.map((profile) => (
        <div key={profile.firstName + profile.lastName}>
          {console.log("Profile ID:", profile.id)}
          <Link to={`/public-profile/${profile.id}`}>
            {profile.firstName} {profile.lastName}
          </Link>
          <p>Contact: {profile.contactPhone}</p>
          <p>Location: {profile.location}</p>
          <p>Portfolio: {profile.portfolio}</p>
          <p>Years of Experience: {profile.yearsOfExperience}</p>
          <p>Skills: {profile.skills.join(", ")}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default FreelancerPublicProfiles;
