import { useState, useEffect } from "react";

const useSkills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/skills/getAllSkills"
        );
        const data = await response.json();
        setSkills(data || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  return skills;
};

export default useSkills;
