import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../assets/css/freelancerPublicProfiles.css";
import { AiOutlineRobot, AiOutlineEnvironment, AiOutlineProfile, AiOutlineTool } from 'react-icons/ai';
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
    <div className="freelancer-profiles-container-opens">
      <div className="profiles-grid-opens">
        {publicProfiles.map((profile, index) => (
          <div key={profile.id} className="profile-card-opens">
            <img
              src={`data:image/jpeg;base64,${profile.profilePictureData}`}
              alt="Profile"
              className="profile-picture-opens"
            />
            <div className="profile-info-freelancer-opens">
              <p className="profile-name-opens">
                <AiOutlineProfile /> {profile.firstName} {profile.lastName}
              </p>
              <p className="profile-detail-opens">
                <AiOutlineRobot /> {profile.aboutFreelancer}
              </p>
              <p className="profile-detail-opens">
                <AiOutlineEnvironment /> {profile.location}
              </p>
              <p className="profile-detail-opens">
                <AiOutlineTool /> {profile.skills.join(", ")}
              </p>
              <Link to={`/public-profile/${profile.id}`} className="view-profile-link-opens">View Profile</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

export default FreelancerPublicProfiles;
