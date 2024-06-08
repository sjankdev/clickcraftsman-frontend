import * as Yup from 'yup';

const validationSchemaCreateJob = Yup.object().shape({
  jobName: Yup.string()
    .max(100, 'Job name must be at most 100 characters')
    .required('Job name is required'),
  description: Yup.string()
    .max(1000, 'Description must be at most 1000 characters')
    .required('Description is required'),
  selectedSkills: Yup.array().min(1, 'At least one skill is required'),
  location: Yup.string().when('isRemote', {
    is: false,
    then: Yup.string().required('Location is required for non-remote jobs'),
  }),
  priceType: Yup.string().required('Price type is required'),
  priceRangeFrom: Yup.number().when('priceType', {
    is: val => val === 'PER_HOUR' || val === 'PER_MONTH',
    then: Yup.number().required('Price range from is required').min(0, 'Price must be greater than or equal to 0'),
  }),
  priceRangeTo: Yup.number().when('priceType', {
    is: val => val === 'PER_HOUR' || val === 'PER_MONTH',
    then: Yup.number().required('Price range to is required').min(Yup.ref('priceRangeFrom'), 'Price range to must be greater than price range from'),
  }),
  budget: Yup.number().when('priceType', {
    is: 'FIXED_PRICE',
    then: Yup.number().required('Budget is required').min(0, 'Budget must be greater than or equal to 0'),
  }),
  jobType: Yup.string().required('Job type is required'),
});

export default validationSchemaCreateJob;
