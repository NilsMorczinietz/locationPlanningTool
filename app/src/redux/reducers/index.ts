import { combineReducers } from 'redux';
import { locationsReducer } from './locationsReducer';

const rootReducer = combineReducers({
    locations: locationsReducer,
});

export default rootReducer;