import { combineReducers } from 'redux';

import user from './user.reducer';
import isFirstTime from './isFirstTime.reducer';

const rootReducer = combineReducers({
    user,
    isFirstTime
});

export default rootReducer;