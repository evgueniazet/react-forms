import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { IFormValues } from '../../interfaces/IFormValues';
import { useDispatch } from 'react-redux';
import { setFormData } from '../../store/reducers';

const schema = yup.object({
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

const HookForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    resolver: (data) => {
      return schema.validate(data, { abortEarly: false }).then(
        () => ({
          values: data,
          errors: {},
        }),
        (validationErrors) => ({
          values: {},
          errors: validationErrors.inner.reduce(
            (acc: Record<keyof IFormValues, string>, error: any) => {
              acc[error.path as keyof IFormValues] = error.message;
              return acc;
            },
            {} as Record<keyof IFormValues, string>
          ),
        })
      );
    },
  });

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    try {
      // Вместо того, чтобы использовать результирующий объект, мы используем данные из хука useForm
      await schema.validate(data, { abortEarly: false });
      dispatch(setFormData(data));
      navigate('/');
    } catch (validationErrors: any) {
      console.error('Validation errors:', validationErrors);
      validationErrors.inner.forEach((error: any) => {
        console.error(`${error.path}: ${error.message}`);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" {...register('name')} />
        {errors.name && <span>{errors.name as React.ReactNode}</span>}
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input type="number" {...register('age')} />
        {errors.age && <span>{errors.age as React.ReactNode}</span>}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input type="text" {...register('email')} />
        {errors.email && <span>{errors.email as React.ReactNode}</span>}
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input type="text" {...register('password')} />
        {errors.password && <span>{errors.password as React.ReactNode}</span>}
      </div>

      <div>
        <label htmlFor="passwordConfirm">Confirm Password:</label>
        <input type="text" {...register('passwordConfirm')} />
        {errors.passwordConfirm && (
          <span>{errors.passwordConfirm as React.ReactNode}</span>
        )}
      </div>

      <div>
        <label>Gender:</label>
        <div>
          <label>
            <input type="radio" {...register('gender')} value="male" />
            Male
          </label>
          <label>
            <input type="radio" {...register('gender')} value="female" />
            Female
          </label>
          <label>
            <input type="radio" {...register('gender')} value="other" />
            Other
          </label>
        </div>
        {errors.gender && <span>{errors.gender as React.ReactNode}</span>}
      </div>

      <button
        type="submit"
        disabled={
          !!errors.name ||
          !!errors.age ||
          !!errors.email ||
          !!errors.password ||
          !!errors.passwordConfirm ||
          !!errors.gender
        }
      >
        Submit
      </button>
    </form>
  );
};

export default HookForm;
