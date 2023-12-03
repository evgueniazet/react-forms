import React, { useState, ChangeEvent, FormEvent } from 'react';
import { schema } from '../../utils/schema';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setFormData,
  setFormImage,
  selectFormData,
  selectCountries,
} from '../../store/reducers/formReducer';
import styles from './UncontrolledForm.module.scss';

interface FormErrors {
  name: string;
  age: string;
  email: string;
  password: string;
  gender: string;
  country: string;
}

interface ValidationError {
  path?: keyof FormErrors;
  message: string;
}

interface ValidationErrors {
  inner: ValidationError[];
}

const UncontrolledForm: React.FC = () => {
  const dispatch = useDispatch();
  const countries = useSelector(selectCountries);
  const navigate = useNavigate();

  const formData = useSelector(selectFormData) || {
    name: '',
    age: '',
    email: '',
    password: '',
    passwordConfirm: '',
    gender: '',
    acceptTerms: false,
    country: '',
  };

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    age: '',
    email: '',
    password: '',
    gender: '',
    country: '',
  });

  console.log('errors', errors);

  const handleCountryChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    try {
      await schema.validateAt(name, { [name]: value });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name as keyof FormErrors]: '',
      }));
      dispatch(setFormData({ ...formData, [name]: value }));
    } catch (error) {
      const validationError = error as ValidationError;
      if (validationError instanceof Error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validationError.message,
        }));
      }
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    try {
      const inputValue =
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      await schema.validateAt(name, { [name]: inputValue });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name as keyof FormErrors]: '',
      }));
    } catch (error) {
      const validationError = error as ValidationError;

      if (validationError instanceof Error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validationError.message,
        }));
      }
    }

    dispatch(setFormData({ ...formData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formDataForValidation = { ...formData };
      await schema.validate(formDataForValidation, { abortEarly: false });
      dispatch(setFormData(formData));
      if (formData.picture) {
        dispatch(
          setFormImage({ image: URL.createObjectURL(formData.picture) })
        );
      }
      navigate('/');
    } catch (error) {
      const validationErrors = error as ValidationErrors;
      if (validationErrors.inner && validationErrors.inner.length > 0) {
        const newErrors: Partial<FormErrors> = {};
        (
          validationErrors.inner as Array<{
            path?: keyof FormErrors;
            message: string;
          }>
        ).forEach((error) => {
          if (error.path) {
            newErrors[error.path as keyof FormErrors] = error.message;
          }
        });
        setErrors(newErrors as FormErrors);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Registration</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="age">Age:</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          {errors.age && <span className={styles.error}>{errors.age}</span>}
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>

        <div className={styles.formItemWrapper}>
          <label>Gender:</label>
          <div className={styles.genderList}>
            <label className={styles.genderItem}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />
              Male
            </label>
            <label className={styles.genderItem}>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              Female
            </label>
            <label className={styles.genderItem}>
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === 'other'}
                onChange={handleChange}
              />
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
            <label htmlFor="country">Select Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleCountryChange}
              list="countriesList"
            />
          </div>

          <datalist id="countriesList">
            {countries.map((country) => (
              <option key={country.id} value={country.name} />
            ))}
          </datalist>
          {errors.country && (
            <span className={styles.error}>{errors.country}</span>
          )}
        </div>

        <button
          className={styles.button}
          type="submit"
          disabled={Object.values(errors).some(Boolean)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UncontrolledForm;
