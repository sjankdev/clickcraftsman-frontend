import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../assets/css/freelancerPublicProfiles.css";
import { AiOutlinePhone, AiOutlineEnvironment, AiOutlineProfile, AiOutlineTool } from 'react-icons/ai';
const FreelancerPublicProfiles = () => {
  const [publicProfiles, setPublicProfiles] = useState([]);

  const [profilePictures, setProfilePictures] = useState([]);

  useEffect(() => {
    console.log("Fetching public profiles...");
    axios
      .get("http://localhost:8080/api/freelancer/getAllFreelancers")
      .then((response) => {
        console.log("Public profiles fetched successfully:", response.data);
        setPublicProfiles(response.data);

        const profileIds = response.data.map((profile) => profile.id).join(",");
        axios
          .get(
            `http://localhost:8080/api/freelancer/getProfilePictures?freelancerIds=${profileIds}`
          )
          .then((pictureResponse) => {
            console.log(
              "Profile pictures fetched successfully:",
              pictureResponse.data
            );
            setProfilePictures(pictureResponse.data);
          })
          .catch((pictureError) => {
            console.error("Error fetching profile pictures:", pictureError);
          });
      })
      .catch((error) => {
        console.error("Error fetching public profiles:", error);
      });
  }, []);

  return (
    <div className="freelancer-public-profiles-container">
      <h1>Public Freelancer Profiles</h1>
      <div className="profiles-list">
        {publicProfiles.map((profile, index) => (
          <div key={profile.id} className="profile-card">
            <div className="profile-details">
              <img
                src={`data:image/jpeg;base64,${profile.profilePictureData}`}
                alt="Profile"
                className="profile-picture"
              />
              <div className="profile-name">
                <AiOutlineProfile /> {profile.firstName} {profile.lastName}
              </div>
              <p className="profile-info">
                <AiOutlinePhone /> {profile.contactPhone}
              </p>
              <p className="profile-info">
                <AiOutlineEnvironment /> {profile.location}
              </p>
              <div className="profile-info">
                <AiOutlineTool />
                {profile.skills.join(", ")}
              </div>
              <div className="profile-links">
                <Link
                  to={`/public-profile/${profile.id}`}
                  className="profile-link"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerPublicProfiles;
