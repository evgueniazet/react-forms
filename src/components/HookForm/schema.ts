import * as yup from 'yup';

export const schema = yup.object({
  name: yup
    .string()
    .matches(/^[A-Z][a-z]*$/, 'Name should start with an uppercase letter')
    .required('Name is required'),
  age: yup
    .string()
    .matches(/^\d+$/, 'Age should be a positive integer')
    .required('Age is required'),
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
    )
    .required('Password is required'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
    )
    .required('Password confirmation is required'),
  gender: yup.string().required('Gender is required'),
});
