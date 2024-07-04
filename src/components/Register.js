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
    profilePicture: "",
    portfolio: "", 
    yearsOfExperience: 0, 
    aboutFreelancer: "", 
    skills: [], 
    companyName: "", 
    companyLocation: "", 
    companySize: "", 
    companyIndustry: "", 
    linkedin: "", 
    website: "", 
    instagram: "", 
  };

  const handleRegister = (formValues, { resetForm }) => {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      contactPhone,
      location,
      profilePicture,
      portfolio,
      yearsOfExperience,
      aboutFreelancer,
      skills,
      companyName,
      companyLocation,
      companySize,
      companyIndustry,
      linkedin,
      website,
      instagram,
    } = formValues;

    const rolesArray = Array.isArray(role) ? role : [role];

    const additionalFields = {
      firstName,
      lastName,
      contactPhone,
      location,
      profilePicture,
      ...(selectedRole === "freelancer" && {
        portfolio,
        yearsOfExperience,
        aboutFreelancer,
        skills,
      }),
      ...(selectedRole === "client" && {
        companyName,
        companyLocation,
        companySize,
        companyIndustry,
        linkedin,
        website,
        instagram,
      }),
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

  const handleRoleChange = (role) => {
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
                onClick={() => handleRoleChange("client")}
                className={`btn btn-role ${
                  selectedRole === "client" ? "btn-primary" : "btn-secondary"
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("freelancer")}
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

                      {selectedRole === "freelancer" && (
                        <>
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
                        </>
                      )}

                      {selectedRole === "client" && (
                        <>
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

                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="linkedin">LinkedIn</label>
                              <Field
                                name="linkedin"
                                type="text"
                                className="form-control"
                                placeholder="Enter your LinkedIn URL"
                              />
                              <ErrorMessage
                                name="linkedin"
                                component="div"
                                className="alert alert-danger"
                              />
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="website">Website</label>
                              <Field
                                name="website"
                                type="text"
                                className="form-control"
                                placeholder="Enter your company website"
                              />
                               <ErrorMessage
                                name="website"
                                component="div"
                                className="alert alert-danger"
                              />
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="instagram">Instagram</label>
                              <Field
                                name="instagram"
                                type="text"
                                className="form-control"
                                placeholder="Enter your Instagram URL"
                              />
                              <ErrorMessage
                                name="instagram"
                                component="div"
                                className="alert alert-danger"
                              />
                            </div>
                          </div>
                        </>
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
