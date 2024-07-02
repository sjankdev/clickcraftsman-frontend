import * as Yup from "yup";

const validationSchemaUpdateFreelancer = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required("This field is required!")
    .min(3, "The first name must be at least 3 characters.")
    .max(20, "The first name cannot exceed 20 characters."),
  lastName: Yup.string()
    .trim()
    .required("This field is required!")
    .min(3, "The last name must be at least 3 characters.")
    .max(20, "The last name cannot exceed 20 characters."),
  contactPhone: Yup.string()
    .trim()
    .matches(/^\+381\d{8,9}$/, "Please enter a valid Serbian phone number")
    .required("This field is required!"),
  location: Yup.string()
    .required("Please, select your location.")
    .test("is-selected", "Location is required!", (val) => val !== ""),
  aboutFreelancer: Yup.string()
    .trim()
    .required("Please provide a brief description about yourself.")
    .min(100, "The description must be at least 100 characters long.")
    .max(2000, "The description cannot exceed 2000 characters."),
  yearsOfExperience: Yup.number()
    .min(0, "Years of experience must be zero or a positive number.")
    .integer("Years of experience must be an integer.")
    .required("This field is required!"),
  skills: Yup.array()
    .min(1, "At least one skill must be selected.")
    .required("At least one skill must be selected."),
});

export default validationSchemaUpdateFreelancer;
