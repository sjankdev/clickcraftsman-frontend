import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import "../../assets/css/freelancerPublicProfiles.css";
import {
  AiOutlineUser,
  AiOutlineInfoCircle,
  AiOutlineEnvironment,
  AiOutlineTool,
} from "react-icons/ai";

const FreelancerPublicProfiles = () => {
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/utils/getAllSkills"
        );
        const formattedSkills = response.data.map((skill) => ({
          value: skill.id,
          label: skill.skillName,
        }));
        setSkillsList(formattedSkills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/utils/getAllLocations"
        );
        const formattedLocations = response.data.map((location) => ({
          value: location,
          label: location,
        }));
        setLocationsList(formattedLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchSkills();
    fetchLocations();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const delay = 300;
    const fetchProfiles = async () => {
      try {
        let response;
        if (selectedSkills.length > 0 && selectedLocations.length > 0) {
          const selectedSkillIds = selectedSkills
            .map((skill) => skill.value)
            .join(",");
          const selectedLocationNames = selectedLocations
            .map((location) => location.value)
            .join(",");
          response = await axios.get(
            `http://localhost:8080/api/freelancer/searchBySkillAndLocation?skillIds=${selectedSkillIds}&locations=${selectedLocationNames}`
          );
        } else if (selectedSkills.length > 0) {
          const selectedSkillIds = selectedSkills
            .map((skill) => skill.value)
            .join(",");
          response = await axios.get(
            `http://localhost:8080/api/freelancer/searchBySkill?skillIds=${selectedSkillIds}`
          );
        } else if (selectedLocations.length > 0) {
          const selectedLocationNames = selectedLocations
            .map((location) => location.value)
            .join(",");
          response = await axios.get(
            `http://localhost:8080/api/freelancer/searchByLocation?locations=${selectedLocationNames}`
          );
        } else {
          response = await axios.get(
            "http://localhost:8080/api/freelancer/getAllFreelancers"
          );
        }
        console.log("Profile API response:", response);
        if (isMounted) {
          setPublicProfiles(response.data);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    const timeoutId = setTimeout(fetchProfiles, delay);

    return () => {
      clearTimeout(timeoutId);
      isMounted = false;
    };
  }, [selectedSkills, selectedLocations]);

  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
  };

  const handleLocationChange = (selectedOptions) => {
    console.log("Selected Locations:", selectedOptions);
    setSelectedLocations(selectedOptions);
  };

  return (
    <div className="freelancer-profiles-container-opens">
      <div className="custom-select-wrapper">
        <Select
          isMulti
          options={skillsList}
          value={selectedSkills}
          onChange={handleSkillChange}
          placeholder="Select skills..."
        />
      </div>
      <div className="custom-select-wrapper">
        {" "}
        <Select
          isMulti
          options={locationsList}
          value={selectedLocations}
          onChange={handleLocationChange}
          placeholder="Select locations..."
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
                <AiOutlineUser className="icon" /> {profile.firstName}{" "}
                {profile.lastName}
              </p>
              <p className="profile-detail-opens">
                <AiOutlineInfoCircle className="icon" />{" "}
                {profile.aboutFreelancer}
              </p>
              <p className="profile-detail-opens">
                <AiOutlineEnvironment className="icon" /> {profile.location}
              </p>
              <p className="profile-detail-opens">
                <AiOutlineTool className="icon" /> {profile.skills.join(", ")}
              </p>
              <div className="view-profile-button-container">
                <Link
                  to={`/public-profile/${profile.id}`}
                  className="view-profile-link-opens"
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
