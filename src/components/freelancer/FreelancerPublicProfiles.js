import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../assets/css/freelancerPublicProfiles.css";

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
                src={`data:image/jpeg;base64,${profilePictures[index]}`}
                alt="Profile"
                className="profile-picture"
              />
              <div className="profile-name">
                {profile.firstName} {profile.lastName}
              </div>
              <div className="profile-heading">Contact</div>
              <p className="profile-info">Phone: {profile.contactPhone}</p>
              <div className="profile-heading">Location</div>
              <p className="profile-info">{profile.location}</p>
              <div className="profile-heading">Portfolio</div>
              <p className="profile-info">{profile.portfolio}</p>
              <div className="profile-heading">Years of Experience</div>
              <p className="profile-info">{profile.yearsOfExperience}</p>
              <div className="profile-heading">Skills</div>
              <p className="profile-info">{profile.skills.join(", ")}</p>
              <div className="profile-description">{profile.description}</div>
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
