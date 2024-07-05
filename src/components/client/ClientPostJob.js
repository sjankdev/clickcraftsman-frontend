import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import ClientService from "../../services/client/client-service";
import UserService from "../../services/utils/user.service";
import useApiData from "../../services/utils/useApiData";
import Select from "react-select";
import authHeader from "../../services/security/auth-header";
import "../../assets/css/jobPost.css";
import validationSchemaCreateJob from "../../services/utils/validationSchemasCreateJob";

const JobPostForm = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [content, setContent] = useState("");
  const skills = useApiData("https://clickcraftsman-backend-latest.onrender.com/api/utils/getAllSkills");
  const locations = useApiData("https://clickcraftsman-backend-latest.onrender.com/api/utils/getAllLocations");

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const unauthorizedError = error.response && error.response.status === 401;
        if (unauthorizedError) {
          setErrorMessage("You are not authorized to view this content.");
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      }
    );
  }, []);

  const userRoles = authHeader().roles || [];

  const initialValues = {
    jobName: "",
    description: "",
    selectedSkills: [],
    isRemote: "No",
    location: "",
    priceType: "",
    priceRangeFrom: "",
    priceRangeTo: "",
    budget: "",
    jobType: "",
    resumeRequired: "No",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user.email;

    const jobPostingData = {
      jobName: values.jobName,
      description: values.description,
      requiredSkillIds: values.selectedSkills.map((skill) => skill.value),
      isRemote: values.isRemote === "Yes",
      location: values.isRemote === "Yes" ? null : values.location,
      priceType: values.priceType,
      priceRangeFrom: values.priceRangeFrom,
      priceRangeTo: values.priceRangeTo,
      budget: values.budget,
      jobType: values.jobType,
      resumeRequired: values.resumeRequired === "Yes",
    };

    ClientService.postJob(userEmail, jobPostingData)
      .then((response) => {
        setSuccessMessage("Job posted successfully!");
        setSubmitting(false);
      })
      .catch((error) => {
        setErrorMessage(
          (error.response && error.response.data && error.response.data.message) ||
          "An error occurred while posting the job."
        );
        setSubmitting(false);
      });
  };

  return (
    <div className="job-post-form">
      {userRoles.includes("ROLE_CLIENT") ? (
        <>
          <h2>Publish Job</h2>
          <div className="form-container">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchemaCreateJob}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ isSubmitting, setFieldValue, setFieldTouched, values, validateForm, touched, errors }) => (
                <Form className="form">
                  <div className="form-row">
                    <div className="form-section">
                      <label htmlFor="jobName">Job Name</label>
                      <Field type="text" id="jobName" name="jobName" />
                      <ErrorMessage name="jobName" component="div" className="error-message" />
                    </div>
                    <div className="form-section">
                      <label htmlFor="description">Job Description</label>
                      <Field as="textarea" id="description" name="description" />
                      <ErrorMessage name="description" component="div" className="error-message" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-section">
                      <label htmlFor="skills">Required Skills:</label>
                      <Select
                        options={skills.map((skill) => ({
                          value: skill.skillName,
                          label: skill.skillName,
                        }))}
                        isMulti
                        onChange={(selectedOptions) => setFieldValue("selectedSkills", selectedOptions)}
                      />
                      <ErrorMessage name="selectedSkills" component="div" className="error-message" />
                    </div>
                    <div className="form-section">
                      <label htmlFor="priceType">Price Type:</label>
                      <Select
                        options={[
                          { value: "PER_HOUR", label: "Per Hour" },
                          { value: "PER_MONTH", label: "Per Month" },
                          { value: "FIXED_PRICE", label: "Fixed Price" },
                        ]}
                        onChange={(selectedOption) => {
                          setFieldValue("priceType", selectedOption.value);
                          setFieldValue("priceRangeFrom", "");
                          setFieldValue("priceRangeTo", "");
                          setFieldValue("budget", "");
                          setFieldTouched("priceType", true, false);
                          validateForm();
                        }}
                        onBlur={() => {
                          setFieldTouched("priceType", true, false);
                          validateForm();
                        }}
                      />
                      {touched.priceType && errors.priceType && (
                        <div className="error-message">{errors.priceType}</div>
                      )}
                    </div>
                    {(values.priceType === "PER_HOUR" || values.priceType === "PER_MONTH") && (
                      <div className="form-section">
                        <div className="price-range">
                          <label htmlFor="priceRangeFrom">Price Range From:</label>
                          <Field type="number" id="priceRangeFrom" name="priceRangeFrom" />
                          <ErrorMessage name="priceRangeFrom" component="div" className="error-message" />
                        </div>
                        <div className="price-range">
                          <label htmlFor="priceRangeTo">Price Range To:</label>
                          <Field type="number" id="priceRangeTo" name="priceRangeTo" />
                          <ErrorMessage name="priceRangeTo" component="div" className="error-message" />
                        </div>
                      </div>
                    )}
                    {values.priceType === "FIXED_PRICE" && (
                      <div className="form-section">
                        <label htmlFor="budget">Budget:</label>
                        <Field type="number" id="budget" name="budget" />
                        <ErrorMessage name="budget" component="div" className="error-message" />
                      </div>
                    )}
                    <div className="form-section">
                      <label htmlFor="jobType">Job Type:</label>
                      <Select
                        options={[
                          { value: "FULL_TIME", label: "Full Time" },
                          { value: "PART_TIME", label: "Part Time" },
                          { value: "CONTRACT", label: "Contract" },
                          { value: "FREELANCE", label: "Freelance" },
                          { value: "INTERNSHIP", label: "Internship" },
                        ]}
                        onChange={(selectedOption) => setFieldValue("jobType", selectedOption.value)}
                      />
                      <ErrorMessage name="jobType" component="div" className="error-message" />
                    </div>
                  </div>
                  <div className="form-row">
                  {values.isRemote === "No" && (
                      <div className="form-section">
                        <label htmlFor="location">Location:</label>
                        <Select
                          options={locations.map((location) => ({
                            value: location,
                            label: location,
                          }))}
                          onChange={(selectedOption) => setFieldValue("location", selectedOption.value)}
                        />
                        <ErrorMessage name="location" component="div" className="error-message" />
                      </div>
                    )}
                    <div className="form-section">
                      <label htmlFor="isRemote">Is Remote?</label>
                      <Field as="select" id="isRemote" name="isRemote">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Field>
                      <ErrorMessage name="isRemote" component="div" className="error-message" />
                    </div>
                    
                    <div className="form-section">
                      <label htmlFor="resumeRequired">Resume Required?</label>
                      <Field as="select" id="resumeRequired" name="resumeRequired">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Field>
                      <ErrorMessage name="resumeRequired" component="div" className="error-message" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting}>
                    Post Job
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </>
      ) : (
        <div className="error-message">You are not authorized to post a job.</div>
      )}
    </div>
  );
};

export default JobPostForm;
