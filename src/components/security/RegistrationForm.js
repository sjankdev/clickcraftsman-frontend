import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/security/RegistrationForm.css';

const RegistrationForm = () => {
  const [userType, setUserType] = useState('client');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    contactPhone: '',
    location: '',
    skills: '',
    portfolio: '',
    yearsOfExperience: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:8080/api/auth/signup', {
      ...formData,
      role: userType === 'worker' ? ['worker'] : ['client'],
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error during registration:', error);
  }
};

  return (
    <div>
      <div>
        <button onClick={() => setUserType('client')}>Client</button>
        <button onClick={() => setUserType('worker')}>Worker</button>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <br />
        <label>
          First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Contact Phone:
          <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </label>
        <br />

        {userType === 'worker' && (
          <>
            <label>
              Skills:
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} required />
            </label>
            <br />
            <label>
              Portfolio:
              <input type="text" name="portfolio" value={formData.portfolio} onChange={handleChange} required />
            </label>
            <br />
            <label>
              Years of Experience:
              <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required />
            </label>
            <br />
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
