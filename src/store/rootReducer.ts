import { combineReducers } from 'redux';
import formReducer from './reducers/formReducer';

const rootReducer = combineReducers({
  form: formReducer,
});

export default rootReducer;
