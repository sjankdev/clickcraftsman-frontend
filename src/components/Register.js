import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { register } from "../slices/auth";
import validationSchema from "../services/utils/validationSchemas";
import Select from "react-select";
import useApiData from "../services/utils/useApiData";
import "../assets/css/register.css";

const Register = () => {
  const [successful, setSuccessful] = useState(false);
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
      instagram,
      aboutFreelancer,
    } = formValue;
    setSuccessful(false);

    const rolesArray = Array.isArray(role) ? role : [role];
    const skillsArray = Array.isArray(skills) ? skills : [skills];
    const additionalFields = {
      firstName,
      lastName,
      contactPhone,
      location,
      portfolio,
      yearsOfExperience,
      profilePicture,
      companyName,
      companyLocation,
      companySize,
      companyIndustry,
      linkedin,
      website,
      instagram,
      aboutFreelancer,
    };

    dispatch(
      register({
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
    <div className="col-md-12 signup-form">
      <div className="card card-container">
        <Formik
          initialValues={initialValues}
          onSubmit={handleRegister}
          validationSchema={validationSchema}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="form-group text-center">
                <label htmlFor="role" className="label-role mb-3">
                  Are you registering as a client or freelancer?
                </label>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    onClick={(e) => handleRoleChange(e, setFieldValue)}
                    value="client"
                    className={`btn btn-role ${
                      values.role === "client" ? "active" : ""
                    }`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRoleChange(e, setFieldValue)}
                    value="freelancer"
                    className={`btn btn-role ml-2 ${
                      values.role === "freelancer" ? "active" : ""
                    }`}
                  >
                    Freelancer
                  </button>
                </div>
              </div>
              {values.role === "freelancer" && (
                <>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="firstName">
                          First Name<span className="text-danger"> *</span>
                        </label>
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
                        <label htmlFor="lastName">
                          Last Name<span className="text-danger"> *</span>
                        </label>
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
                        <label htmlFor="email">
                          Email<span className="text-danger"> *</span>
                        </label>
                        <Field
                          name="email"
                          type="email"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">
                          Password<span className="text-danger"> *</span>
                        </label>
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
                        <label htmlFor="contactPhone">
                          Contact Phone<span className="text-danger"> *</span>
                        </label>
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
                        <label htmlFor="location">
                          Location:<span className="text-danger"> *</span>
                        </label>
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
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="skills">
                          Select Skills<span className="text-danger"> *</span>
                        </label>
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

                      <div className="form-group">
                        <label htmlFor="aboutFreelancer">
                          About Me<span className="text-danger"> *</span>
                        </label>
                        <Field
                          name="aboutFreelancer"
                          as="textarea"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="aboutFreelancer"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="yearsOfExperience">
                          Years of Experience
                          <span className="text-danger"> *</span>
                        </label>
                        <Field
                          name="yearsOfExperience"
                          type="number"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="yearsOfExperience"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="portfolio">
                          Portfolio{" "}
                          <span className="optional-text">(Optional)</span>
                        </label>
                        <Field
                          name="portfolio"
                          type="text"
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="profilePicture">
                          Upload Profile Picture{" "}
                          <span className="optional-text">(Optional)</span>
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
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {values.role === "client" && (
                <>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="firstName">
                          First Name<span className="text-danger"> *</span>
                        </label>
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
                        <label htmlFor="lastName">
                          Last Name<span className="text-danger"> *</span>
                        </label>
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
                        <label htmlFor="email">
                          Email<span className="text-danger"> *</span>
                        </label>
                        <Field
                          name="email"
                          type="email"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">
                          Password<span className="text-danger"> *</span>
                        </label>
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
                        <label htmlFor="contactPhone">
                          Contact Phone<span className="text-danger"> *</span>
                        </label>
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
                        <label htmlFor="location">
                          Location<span className="text-danger"> *</span>
                        </label>
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

                      <div className="form-group">
                        <label htmlFor="profilePicture">
                          Upload Profile Picture{" "}
                          <span className="optional-text">(Optional)</span>
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
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="companyName">
                          Company Name{" "}
                          <span className="optional-text">(Optional)</span>
                        </label>
                        <Field
                          name="companyName"
                          type="text"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="companyName"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="companyLocation">
                          Company Location{" "}
                          <span className="optional-text">(Optional)</span>
                        </label>
                        <Field
                          name="companyLocation"
                          type="text"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="companyLocation"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="companySize">
                          Company Size{" "}
                          <span className="optional-text">(Optional)</span>
                        </label>
                        <Field
                          name="companySize"
                          type="text"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="companySize"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="companyIndustry">
                          Company Industry{" "}
                          <span className="optional-text">(Optional)</span>
                        </label>
                        <Field
                          name="companyIndustry"
                          type="text"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="companyIndustry"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="linkedin">
                          LinkedIn{" "}
                          <span className="optional-text">(Optional)</span>
                        </label>
                        <Field
                          name="linkedin"
                          type="text"
                          className="form-control"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="website">
                          Website{" "}
                          <span className="optional-text">(Optional)</span>
                        </label>
                        <Field
                          name="website"
                          type="text"
                          className="form-control"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="instagram">
                          Instagram{" "}
                          <span className="optional-text">(Optional)</span>
                        </label>
                        <Field
                          name="instagram"
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
