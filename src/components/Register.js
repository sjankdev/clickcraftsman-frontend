import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";

import { register } from "../slices/auth";
import { clearMessage } from "../slices/message";
import validationSchema from "../services/validationSchemas";

const Register = () => {
  const [successful, setSuccessful] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [skills, setSkills] = useState([]);

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());

    const fetchSkills = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/skills/getAllSkills"
        );
        const data = await response.json();
        console.log("Raw response:", response);
        setSkills(data || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, [dispatch]);

  const initialValues = {
    username: "",
    email: "",
    password: "",
    role: "",
    firstName: "",
    lastName: "",
    contactPhone: "",
    location: "",
    portfolio: "",
    yearsOfExperience: 0,
  };

  const handleRegister = (formValue, { resetForm }) => {
    const {
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      contactPhone,
      location,
      portfolio,
      yearsOfExperience,
      skills,
    } = formValue;
    setSuccessful(false);

    const rolesArray = Array.isArray(role) ? role : [role];

    // Ensure that skills is an array
    const skillsArray = Array.isArray(skills) ? skills : [skills];

    const additionalFields = {
      firstName,
      lastName,
      contactPhone,
      location,
      portfolio,
      yearsOfExperience,
    };

    dispatch(
      register({
        username,
        email,
        password,
        role: rolesArray,
        skills: skillsArray,
        ...additionalFields,
      })
    )
      .unwrap()
      .then(() => {
        setSuccessful(true);
        resetForm();
      })
      .catch(() => {
        setSuccessful(false);
      });
  };

  const handleRoleChange = (event, setFieldValue) => {
    const role = event.target.value;
    setSelectedRole(role);
    setFieldValue("role", role);
  };

  return (
    <div className="col-md-12 signup-form">
      <div className="card card-container">
        <Formik
          initialValues={initialValues}
          onSubmit={handleRegister}
          validationSchema={validationSchema}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="role">Select Role:</label>
                <div>
                  <button
                    type="button"
                    onClick={(e) => handleRoleChange(e, setFieldValue)}
                    value="client"
                    className="btn btn-secondary"
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRoleChange(e, setFieldValue)}
                    value="worker"
                    className="btn btn-secondary ml-2"
                  >
                    Worker
                  </button>
                </div>
              </div>

              {selectedRole === "worker" && (
                <>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <Field
                      name="username"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <Field
                      name="firstName"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <Field
                      name="lastName"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactPhone">Contact Phone</label>
                    <Field
                      name="contactPhone"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="contactPhone"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <Field
                      name="location"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="location"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="skills">Select Skills:</label>
                    <Field
                      name="skills"
                      as="select"
                      multiple
                      className="form-control"
                    >
                      {skills.map((skill) => (
                        <option
                          key={skill.id || skill.skillName}
                          value={skill.skillName}
                        >
                          {skill.skillName}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <div className="form-group">
                    <label htmlFor="portfolio">Portfolio</label>
                    <Field
                      name="portfolio"
                      type="text"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="yearsOfExperience">
                      Years of Experience
                    </label>
                    <Field
                      name="yearsOfExperience"
                      type="number"
                      className="form-control"
                    />
                  </div>
                </>
              )}

              {selectedRole === "client" && (
                <>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <Field
                      name="username"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <Field
                      name="firstName"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <Field
                      name="lastName"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactPhone">Contact Phone</label>
                    <Field
                      name="contactPhone"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="contactPhone"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <Field
                      name="location"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="location"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                </>
              )}

              {selectedRole && (
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign Up
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>

      {message && (
        <div className="form-group">
          <div
            className={
              successful ? "alert alert-success" : "alert alert-danger"
            }
            role="alert"
          >
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
