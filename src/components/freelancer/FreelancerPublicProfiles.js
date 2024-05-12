import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../assets/css/freelancerPublicProfiles.css";
import { AiOutlineUser, AiOutlineInfoCircle, AiOutlineEnvironment, AiOutlineTool } from 'react-icons/ai';

const FreelancerPublicProfiles = () => {
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== "") {
      axios
        .get(`http://localhost:8080/api/freelancer/search?skillName=${debouncedSearchTerm}`)
        .then((response) => {
          setPublicProfiles(response.data);
        })
        .catch((error) => {
          console.error("Error searching profiles:", error);
        });
    } else {
      axios
        .get("http://localhost:8080/api/freelancer/getAllFreelancers")
        .then((response) => {
          setPublicProfiles(response.data);
        })
        .catch((error) => {
          console.error("Error fetching public profiles:", error);
        });
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="freelancer-profiles-container-opens">
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by skill name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
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
                <AiOutlineUser className="icon" /> {profile.firstName} {profile.lastName}
              </p>
              <p className="profile-detail-opens">
                <AiOutlineInfoCircle className="icon" /> {profile.aboutFreelancer}
              </p>
              <p className="profile-detail-opens">
                <AiOutlineEnvironment className="icon" /> {profile.location}
              </p>
              <p className="profile-detail-opens">
                <AiOutlineTool className="icon" /> {profile.skills.join(", ")}
              </p>
              <div className="view-profile-button-container">
                <Link to={`/public-profile/${profile.id}`} className="view-profile-link-opens">View Profile</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerPublicProfiles;
