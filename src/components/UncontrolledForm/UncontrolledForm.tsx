import React, { useState, ChangeEvent, FormEvent } from 'react';
import { schema } from '../../utils/schema';
import { useNavigate } from 'react-router-dom';
import styles from './UncontrolledForm.module.scss';

interface FormErrors {
  name: string;
  age: string;
  email: string;
  password: string;
  passwordConfirm: string;
  gender: string;
  acceptTerms: string;
}

interface ValidationError {
  path?: keyof FormErrors;
  message: string;
}

interface ValidationErrors {
  inner: ValidationError[];
}

const UncontrolledForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    passwordConfirm: '',
    gender: '',
    acceptTerms: false,
    picture: null as File | null,
    country: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    age: '',
    email: '',
    password: '',
    passwordConfirm: '',
    gender: '',
    acceptTerms: '',
  });

  const navigate = useNavigate();

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

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, picture: file }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await schema.validate(formData, { abortEarly: false });
      console.log('Form submitted:', formData);
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

          {errors.name && <p>{errors.name}</p>}
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

          {errors.age && <p>{errors.age}</p>}
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

          {errors.email && <p>{errors.email}</p>}
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

          {errors.password && <p>{errors.password}</p>}
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="passwordConfirm">Confirm Password:</label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
            />
          </div>

          {errors.passwordConfirm && <p>{errors.passwordConfirm}</p>}
        </div>

        <div className={styles.formItemWrapper}>
          <label>Gender:</label>
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
              />
              Accept Terms & Conditions
            </label>
          </div>

          {errors.acceptTerms && <p>{errors.acceptTerms}</p>}
        </div>

        <div className={styles.formItemWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="picture">Upload Picture:</label>
            <input
              type="file"
              name="picture"
              accept=".png, .jpg, .jpeg"
              onChange={handlePictureChange}
            />
          </div>
        </div>

        <div className={styles.formItemWrapper}>
          <label htmlFor="country">Select Country:</label>
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
