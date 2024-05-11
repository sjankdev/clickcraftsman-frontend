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
  linkedin: Yup.string()
    .url("Invalid LinkedIn URL format.")
    .nullable(),
  website: Yup.string()
    .url("Invalid website URL format.")
    .nullable(),
  instagram: Yup.string()
    .url("Invalid Instagram URL format.")
    .nullable(),
  role: Yup.string().test('role', 'Role value: ${value}', function (value) {
    console.log('Role:', value);
    return true;
  }),
  aboutFreelancer: Yup.string().when('role', {
    is: (role) => role === 'freelancer',
    then: Yup.string().required("About Me is required")
      .test('test-about-freelancer', 'About Me test', function (value) {
        console.log('About Freelancer Value:', value);
        return true; 
      })
  }),
  yearsOfExperience: Yup.number().when('role', {
    is: (role) => role === 'freelancer',
    then: Yup.number()
      .min(0, "Years of experience must be zero or a positive number.")
      .integer("Years of experience must be an integer.")
  }),
  skills: Yup.array().when('role', {
    is: (role) => role === 'freelancer',
    then: Yup.array().of(Yup.string())
      .min(1, "At least one skill must be selected.")
  })
});


export default validationSchema;
