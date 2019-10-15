import { all } from 'redux-saga/effects';

import logoutSaga from './logout.saga';
import notificationSaga from './notification.saga';

export default function* rootSaga() {
    yield all([
        logoutSaga(),
        notificationSaga()
    ])
}