export interface IFormValues {
  name: string;
  age: number;
  email: string;
  password: string;
  passwordConfirm: string;
  gender: 'male' | 'female' | 'other';
}

export interface IFormState {
  formData: IFormValues | null;
}