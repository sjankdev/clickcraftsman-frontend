import * as Yup from "yup";

const validationSchemaCreateJob = Yup.object().shape({
  jobName: Yup.string()
    .max(100, "Job name must be at most 100 characters")
    .min(5, "Job name must be at least 5 characters")
    .required("Job name is required"),
  description: Yup.string()
    .max(1000, "Description must be at most 1000 characters")
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  selectedSkills: Yup.array().min(1, "At least one skill is required"),
  isRemote: Yup.string().required("Is Remote is required"),
  location: Yup.string().when("isRemote", {
    is: "No",
    then: Yup.string().required("Location is required for non-remote jobs"),
  }),
  priceType: Yup.string().required("Price type is required"),
  priceRangeFrom: Yup.number().when("priceType", {
    is: (val) => val === "PER_HOUR" || val === "PER_MONTH",
    then: Yup.number()
      .required("Price range from is required")
      .min(0, "Price must be greater than or equal to 0")
      .test(
        "is-less-than-priceRangeTo",
        "Price range from must be less than price range to",
        function (value) {
          return (
            value === undefined ||
            this.parent.priceRangeTo === undefined ||
            value < this.parent.priceRangeTo
          );
        }
      ),
  }),
  priceRangeTo: Yup.number().when(["priceType", "priceRangeFrom"], {
    is: (val, priceRangeFrom) =>
      (val === "PER_HOUR" || val === "PER_MONTH") &&
      priceRangeFrom !== undefined,
    then: Yup.number()
      .required("Price range to is required")
      .min(
        Yup.ref("priceRangeFrom"),
        "Price range to must be greater than price range from"
      )
      .test(
        "is-not-negative",
        "Price must be greater than or equal to 0",
        function (value) {
          return value === undefined || value >= 0;
        }
      ),
  }),

  budget: Yup.number().when("priceType", {
    is: "FIXED_PRICE",
    then: Yup.number()
      .required("Budget is required")
      .min(0, "Budget must be greater than or equal to 0"),
  }),
  jobType: Yup.string().required("Job type is required"),
});

export default validationSchemaCreateJob;
