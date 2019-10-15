import { combineReducers } from 'redux';

import user from './user.reducer';
import isFirstTime from './isFirstTime.reducer';
import notification from './notification.reducer';

const rootReducer = combineReducers({
    user,
    isFirstTime,
    notification
});

export default rootReducer;