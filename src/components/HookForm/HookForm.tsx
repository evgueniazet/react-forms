import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { IFormValues } from '../../interfaces/IFormValues';
import { useDispatch } from 'react-redux';
import { setFormData } from '../../store/reducers';
import { schema } from './schema';
import styles from './HookForm.module.scss';

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
            <input type="text" {...register('password')} />
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
            <input type="text" {...register('passwordConfirm')} />
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
