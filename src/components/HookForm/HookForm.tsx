import React from 'react';
import { useForm, SubmitHandler, UseFormSetValue } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { IFormValues } from '../../interfaces/IFormValues';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFormData,
  setFormImage,
  selectFormImage,
} from '../../store/reducers/formReducer';
import { schema } from '../../utils/schema';
import styles from './HookForm.module.scss';

interface IValidationError {
  path?: keyof IFormValues;
  message: string;
}

interface IValidationErrors {
  inner: IValidationError[];
}

const HookForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formImage = useSelector(selectFormImage);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormValues>({
    resolver: async (data: IFormValues) => {
      try {
        await schema.validate(data, { abortEarly: false });
        return {
          values: data,
          errors: {},
        };
      } catch (error) {
        const validationErrors = error as IValidationErrors;
        return {
          values: {} as IFormValues,
          errors: validationErrors.inner.reduce(
            (
              acc: Record<keyof IFormValues, string>,
              error: IValidationError
            ) => {
              acc[error.path as keyof IFormValues] = error.message;
              return acc;
            },
            {} as Record<keyof IFormValues, string>
          ),
        };
      }
    },
  });

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    try {
      await schema.validate(data, { abortEarly: false });
      dispatch(setFormData(data));
      dispatch(setFormImage({ image: formImage }));
      navigate('/');
    } catch (validationErrors: IValidationErrors | unknown) {
      if (validationErrors) {
        console.error('Validation errors:', validationErrors);
        const errors = (validationErrors as IValidationErrors)?.inner;
        if (errors) {
          errors.forEach((error: IValidationError) => {
            console.error(`${error.path}: ${error.message}`);
          });
        }
      }
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('1');

    if (file) {
      const reader = new FileReader();
      console.log('reader', reader);

      reader.onloadend = () => {
        const base64Image = reader.result?.toString() || '';
        dispatch(setFormImage({ image: base64Image }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            {' '}
            <label htmlFor="name">Name:</label>
            <input type="text" {...register('name')} />
          </div>
          {errors.name && (
            <span className={styles.error}>
              {errors.name as React.ReactNode}
            </span>
          )}
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            {' '}
            <label htmlFor="age">Age:</label>
            <input type="number" {...register('age')} />
          </div>
          {errors.age && (
            <span className={styles.error}>
              {errors.age as React.ReactNode}
            </span>
          )}
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="email">Email:</label>
            <input type="text" {...register('email')} />
          </div>
          {errors.email && (
            <span className={styles.error}>
              {errors.email as React.ReactNode}
            </span>
          )}
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="password">Password:</label>
            <input type="password" {...register('password')} />
          </div>
          {errors.password && (
            <span className={styles.error}>
              {errors.password as React.ReactNode}
            </span>
          )}
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="passwordConfirm">Confirm Password:</label>
            <input type="password" {...register('passwordConfirm')} />
          </div>
          {errors.passwordConfirm && (
            <span className={styles.error}>
              {errors.passwordConfirm as React.ReactNode}
            </span>
          )}
        </div>

        <div className={styles.formItemWrapper}>
          <label>Gender:</label>
          <div className={styles.genderList}>
            <label className={styles.genderItem}>
              <input type="radio" {...register('gender')} value="male" />
              Male
            </label>
            <label className={styles.genderItem}>
              <input type="radio" {...register('gender')} value="female" />
              Female
            </label>
            <label className={styles.genderItem}>
              <input type="radio" {...register('gender')} value="other" />
              Other
            </label>
          </div>
          {errors.gender && (
            <span className={styles.error}>
              {errors.gender as React.ReactNode}
            </span>
          )}
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="acceptTerms">
              <input type="checkbox" {...register('acceptTerms')} />
              Accept Terms & Conditions
            </label>
          </div>
          {errors.acceptTerms && (
            <span className={styles.error}>
              {errors.acceptTerms as React.ReactNode}
            </span>
          )}
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="picture">Upload Picture:</label>
            <input
              type="file"
              {...register('picture')}
              onChange={(e) => {
                setValue('picture', e.target.files?.[0]);
                handleImageChange(e);
              }}
            />
          </div>
          {errors.picture && (
            <span className={styles.error}>
              {errors.picture as React.ReactNode}
            </span>
          )}
        </div>

        <button
          className={styles.button}
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
    </div>
  );
};

export default HookForm;
