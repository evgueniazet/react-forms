import React, { useState, ChangeEvent, FormEvent } from 'react';
import { schema } from '../../utils/schema';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input
          type="text"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
        {errors.age && <p>{errors.age}</p>}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p>{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="passwordConfirm">Confirm Password:</label>
        <input
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
        />
        {errors.passwordConfirm && <p>{errors.passwordConfirm}</p>}
      </div>

      <div>
        <label>Gender:</label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
          />
          Accept Terms & Conditions
        </label>
        {errors.acceptTerms && <p>{errors.acceptTerms}</p>}
      </div>

      <div>
        <label htmlFor="picture">Upload Picture:</label>
        <input
          type="file"
          name="picture"
          accept=".png, .jpg, .jpeg"
          onChange={handlePictureChange}
        />
      </div>

      <div>
        <label htmlFor="country">Select Country:</label>
      </div>

      <button type="submit" disabled={Object.values(errors).some(Boolean)}>
        Submit
      </button>
    </form>
  );
};

export default UncontrolledForm;
