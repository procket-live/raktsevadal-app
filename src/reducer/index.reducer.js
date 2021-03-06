import { combineReducers } from 'redux';

import user from './user.reducer';
import isFirstTime from './isFirstTime.reducer';
import notification from './notification.reducer';
import myRequest from './myRequest.reducer';
import nearbyRequest from './nearbyRequest.reducer';
import nearbyCamp from './nearbyCamp.reducer';

const rootReducer = combineReducers({
    user,
    isFirstTime,
    notification,
    myRequest,
    nearbyRequest,
    nearbyCamp
});

export default rootReducer;