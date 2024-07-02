import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { register } from "../slices/auth";
import validationSchema from "../services/utils/validationSchemas";
import Select from "react-select";
import useApiData from "../services/utils/useApiData";

const Register = () => {
  const [successful, setSuccessful] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const locations = useApiData(
    "https://clickcraftsman-frontend.vercel.app/api/utils/getAllLocations"
  );
  const skills = useApiData("https://clickcraftsman-frontend.vercel.app/api/utils/getAllSkills");

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
          {({ setFieldValue, values }) => {
            console.log('Form Values:', values);
            console.log('Selected Role:', selectedRole);
            return (
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
                      value="freelancer"
                      className="btn btn-secondary ml-2"
                    >
                      Freelancer
                    </button>
                  </div>
                </div>

                {values.role === "freelancer" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="profilePicture">Upload Profile Picture</label>
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
                      <label htmlFor="aboutFreelancer">About Me</label>
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
                      <ErrorMessage
                        name="yearsOfExperience"
                        component="div"
                        className="alert alert-danger"
                      />
                    </div>
                  </>
                )}

                {values.role === "client" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="profilePicture">Upload Profile Picture</label>
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
                    <div className="form-group">
                      <label htmlFor="companyName">Company Name</label>
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
                      <label htmlFor="companyLocation">Company Location</label>
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
                      <label htmlFor="companySize">Company Size</label>
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
                      <label htmlFor="companyIndustry">Company Industry</label>
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
                      <label htmlFor="instagram">Instagram</label>
                      <Field
                        name="instagram"
                        type="text"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="instagram"
                        component="div"
                        className="alert alert-danger"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="linkedin">Linkedin</label>
                      <Field
                        name="linkedin"
                        type="text"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="linkedin"
                        component="div"
                        className="alert alert-danger"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="website">Website</label>
                      <Field
                        name="website"
                        type="text"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="website"
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
            );
          }}
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
