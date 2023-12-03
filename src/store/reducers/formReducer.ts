import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFormValues } from '../../interfaces/IFormValues';

interface SetFormImagePayload {
  image: string | null;
}

interface Country {
  id: number;
  name: string;
}

interface IFormState {
  formData: IFormValues | null;
  formImage: string | null;
  countries: Country[];
}

const initialState: IFormState = {
  formData: null,
  formImage: null,
  countries: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<IFormValues>) => {
      state.formData = action.payload;
    },
    setFormImage: (state, action: PayloadAction<SetFormImagePayload>) => {
      state.formImage = action.payload.image;
    },
    setCountries: (state, action: PayloadAction<Country[]>) => {
      state.countries = action.payload;
    },
  },
});

export const { setFormData, setFormImage, setCountries } = formSlice.actions;
export const selectFormData = (state: { form: IFormState }) =>
  state.form.formData;
export const selectFormImage = (state: { form: IFormState }) =>
  state.form.formImage;
export const selectCountries = (state: { form: IFormState }) =>
  state.form.countries;

export default formSlice.reducer;
