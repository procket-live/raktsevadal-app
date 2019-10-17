import { all } from 'redux-saga/effects';

import logoutSaga from './logout.saga';
import notificationSaga from './notification.saga';
import myRequestSaga from './myRequest.saga';
import nearbyRequestSaga from './nearbyRequest.saga';

export default function* rootSaga() {
    yield all([
        logoutSaga(),
        notificationSaga(),
        myRequestSaga(),
        nearbyRequestSaga()
    ])
}