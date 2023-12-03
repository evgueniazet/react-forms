export interface IFormValues {
  name: string;
  age: number;
  email: string;
  password: string;
  passwordConfirm: string;
  gender: string;
  acceptTerms: boolean;
  picture?: File;
  country: string; 
}

export interface IFormState {
  formData: IFormValues | null;
  formImage: string | null,
}