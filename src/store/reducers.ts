import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFormState, IFormValues } from '../interfaces/IFormValues';

const initialState: IFormState = {
  formData: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<IFormValues>) => {
      state.formData = action.payload;
    },
  },
});

export const { setFormData } = formSlice.actions;
export const selectFormData = (state: { form: IFormState }) =>
  state.form.formData;
export default formSlice.reducer;
