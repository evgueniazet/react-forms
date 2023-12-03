import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFormState, IFormValues } from '../../interfaces/IFormValues';

interface SetFormImagePayload {
  image: string | null;
}

const initialState: IFormState = {
  formData: null,
  formImage: null,
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
  },
});

export const { setFormData, setFormImage } = formSlice.actions;
export const selectFormData = (state: { form: IFormState }) =>
  state.form.formData;
export const selectFormImage = (state: { form: IFormState }) =>
  state.form.formImage;
export default formSlice.reducer;
