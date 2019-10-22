import { all } from 'redux-saga/effects';

import logoutSaga from './logout.saga';
import notificationSaga from './notification.saga';
import myRequestSaga from './myRequest.saga';
import nearbyRequestSaga from './nearbyRequest.saga';
import rehydrateSaga from './onRehydrate.saga';
import nearbyCampSaga from './nearbyCamp.saga';

export default function* rootSaga() {
    yield all([
        logoutSaga(),
        notificationSaga(),
        myRequestSaga(),
        nearbyRequestSaga(),
        rehydrateSaga(),
        nearbyCampSaga(),
    ])
}