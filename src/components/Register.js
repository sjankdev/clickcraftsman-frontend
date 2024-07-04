import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { register } from "../slices/auth";
import validationSchema from "../services/utils/validationSchemas";
import Select from "react-select";
import useApiData from "../services/utils/useApiData";
import "../assets/css/register.css";

const Register = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const locations = useApiData(
    "https://clickcraftsman-backend-latest.onrender.com/api/utils/getAllLocations"
  );
  const skills = useApiData(
    "https://clickcraftsman-backend-latest.onrender.com/api/utils/getAllSkills"
  );

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
    role: "",
    firstName: "",
    lastName: "",
    contactPhone: "",
    location: "",
    portfolio: "",
    yearsOfExperience: 0,
    profilePicture: "",
    companyName: "", 
    companyLocation: "", 
    companySize: "", 
    companyIndustry: "", 
    linkedin: "",
    website: "", 
    instagram: "",
    aboutFreelancer: "", 
    skills: [],
  };

  const handleRegister = (formValue, { resetForm }) => {
    const {
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
      profilePicture,
      companyName,
      companyLocation,
      companySize,
      companyIndustry,
      linkedin,
      website,
      aboutFreelancer,
    } = formValue;

    const rolesArray = Array.isArray(role) ? role : [role];
    const skillsArray = Array.isArray(skills) ? skills : [skills];

    const additionalFields = {
      firstName,
      lastName,
      contactPhone,
      location,
      portfolio,
      yearsOfExperience,
      skills: selectedRole === "freelancer" ? skillsArray : [],
      profilePicture,
      ...(selectedRole === "client" && {
        companyName,
        companyLocation,
        companySize,
        companyIndustry,
        website,
      }),
      ...(selectedRole === "freelancer" && { aboutFreelancer }),
      linkedin,
    };

    dispatch(
      register({
        email,
        password,
        role: rolesArray,
        ...additionalFields,
      })
    )
      .unwrap()
      .then(() => {
        resetForm();
      })
      .catch(() => {
      });
  };

  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
  };

  const locationOptions = locations.map((location) => ({
    value: location,
    label: formatLocationName(location),
  }));

  function formatLocationName(location) {
    const words = location.split("_");
    const formattedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return formattedWords.join(" ");
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card card-container">
            <h3 className="text-center mb-4">Choose Your Role</h3>
            <div className="d-flex justify-content-center mb-4">
              <button
                type="button"
                onClick={() =>
                  handleRoleChange({ target: { value: "client" } })
                }
                className={`btn btn-role ${
                  selectedRole === "client" ? "btn-primary" : "btn-secondary"
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() =>
                  handleRoleChange({ target: { value: "freelancer" } })
                }
                className={`btn btn-role ${
                  selectedRole === "freelancer"
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                Freelancer
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedRole && (
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card card-container">
              <Formik
                initialValues={initialValues}
                onSubmit={handleRegister}
                validationSchema={validationSchema}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <Field
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="alert alert-danger"
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <Field
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="alert alert-danger"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="firstName">First Name</label>
                          <Field
                            name="firstName"
                            type="text"
                            className="form-control"
                            placeholder="Enter your first name"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="alert alert-danger"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="lastName">Last Name</label>
                          <Field
                            name="lastName"
                            type="text"
                            className="form-control"
                            placeholder="Enter your last name"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="alert alert-danger"
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="contactPhone">Contact Phone</label>
                          <Field
                            name="contactPhone"
                            type="text"
                            className="form-control"
                            placeholder="Enter your phone number"
                          />
                          <ErrorMessage
                            name="contactPhone"
                            component="div"
                            className="alert alert-danger"
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="location">Location:</label>
                          <Field name="location">
                            {({ field, form }) => (
                              <Select
                                {...field}
                                options={locationOptions}
                                isSearchable
                                placeholder="Search or select a location"
                                value={locationOptions.find(
                                  (option) => option.value === field.value
                                )}
                                onChange={(selectedOption) =>
                                  form.setFieldValue(
                                    "location",
                                    selectedOption ? selectedOption.value : ""
                                  )
                                }
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="location"
                            component="div"
                            className="alert alert-danger"
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="portfolio">Portfolio</label>
                          <Field
                            name="portfolio"
                            type="text"
                            className="form-control"
                            placeholder="Enter your portfolio URL"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="yearsOfExperience">
                            Years of Experience
                          </label>
                          <Field
                            name="yearsOfExperience"
                            type="number"
                            className="form-control"
                            placeholder="Enter years of experience"
                          />
                          <ErrorMessage
                            name="yearsOfExperience"
                            component="div"
                            className="alert alert-danger"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="profilePicture">
                            Upload Profile Picture
                          </label>
                          <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            onChange={(event) => {
                              setFieldValue(
                                "profilePicture",
                                event.currentTarget.files[0]
                              );
                            }}
                            className="form-control-file"
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
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
                          <ErrorMessage
                            name="skills"
                            component="div"
                            className="alert alert-danger"
                          />
                        </div>
                      </div>

                      {selectedRole === "client" && (
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="companyName">Company Name</label>
                            <Field
                              name="companyName"
                              type="text"
                              className="form-control"
                              placeholder="Enter your company name"
                            />
                          </div>
                        </div>
                      )}

                      {selectedRole === "client" && (
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="companyLocation">
                              Company Location
                            </label>
                            <Field
                              name="companyLocation"
                              type="text"
                              className="form-control"
                              placeholder="Enter your company location"
                            />
                          </div>
                        </div>
                      )}

                      {selectedRole === "client" && (
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="companySize">Company Size</label>
                            <Field
                              name="companySize"
                              type="text"
                              className="form-control"
                              placeholder="Enter your company size"
                            />
                          </div>
                        </div>
                      )}

                      {selectedRole === "client" && (
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="companyIndustry">
                              Company Industry
                            </label>
                            <Field
                              name="companyIndustry"
                              type="text"
                              className="form-control"
                              placeholder="Enter your company industry"
                            />
                          </div>
                        </div>
                      )}

                      {selectedRole === "client" && (
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="website">Website</label>
                            <Field
                              name="website"
                              type="text"
                              className="form-control"
                              placeholder="Enter your company website"
                            />
                          </div>
                        </div>
                      )}

                      {selectedRole === "freelancer" && (
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="aboutFreelancer">
                              About Freelancer
                            </label>
                            <Field
                              name="aboutFreelancer"
                              as="textarea"
                              className="form-control"
                              placeholder="Tell us about yourself"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Sign Up
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            {message && (
              <div className="form-group">
                <div
                  className={`alert ${
                    message.includes("successful")
                      ? "alert-success"
                      : "alert-danger"
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
