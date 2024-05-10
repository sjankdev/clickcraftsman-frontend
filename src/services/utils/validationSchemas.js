import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("This is not a valid email.")
    .required("Email is required!"),
  password: Yup.string()
    .test(
      "len",
      "The password must be between 6 and 40 characters.",
      (val) => val && val.toString().length >= 6 && val.toString().length <= 40
    )
    .required("This field is required!"),
  firstName: Yup.string()
    .test(
      "len",
      "The first name must be between 3 and 20 characters.",
      (val) => val && val.trim().length >= 3 && val.trim().length <= 20
    )
    .required("This field is required!"),
  lastName: Yup.string()
    .test(
      "len",
      "The last name must be between 3 and 20 characters.",
      (val) => val && val.trim().length >= 3 && val.trim().length <= 20
    )
    .required("This field is required!"),
  contactPhone: Yup.string()
    .test(
      "len",
      "The contact phone must be between 9 and 20 characters.",
      (val) => val && val.trim().length >= 9 && val.trim().length <= 20
    )
    .required("This field is required!"),
  location: Yup.string()
    .required("Location is required!")
    .test("is-selected", "Location is required!", (val) => val !== ""),
  aboutFreelancer: Yup.string()
    .test(
      "len",
      "The about freelancer must be between 0 and 1000 characters.",
      (val) => val && val.trim().length >= 0 && val.trim().length <= 1000
    )
    .required("This field is required!"),
  yearsOfExperience: Yup.number()
    .positive("Years of experience must be a positive number.")
    .required("This field is required!"),
  skills: Yup.array()
    .of(Yup.string())
    .min(1, "At least one skill must be selected.")
    .required("This field is required!"),
  linkedin: Yup.string()
    .url("Invalid LinkedIn URL format.")
    .nullable(),
  website: Yup.string()
    .url("Invalid website URL format.")
    .nullable(),
  instagram: Yup.string()
    .url("Invalid Instagram URL format.")
    .nullable(),
});

export default validationSchema;
