import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("This is not a valid email.")
    .required("This field is required!"),
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
    .test(
      "len",
      "The location must be between 2 and 40 characters.",
      (val) => val && val.trim().length >= 2 && val.trim().length <= 40
    )
    .required("This field is required!"),
});

export default validationSchema;
