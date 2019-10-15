import { call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_NOTIFICATION } from "../constants/redux.constant";
import PrivateApi from '../api/api.private';
import { setNotificationLoading, setNotifications } from '../action/notification.action';
import { AccessNestedObject } from '../utils/common.util';

function* notification() {
    yield put(setNotificationLoading(true))
    const result = yield call(PrivateApi.getNotifications);
    yield put(setNotificationLoading(false))
    if (result.success) {
        const notifications = AccessNestedObject(result, 'response', []);
        yield put(setNotifications(notifications));
    }
}

export default function* () {
    yield takeLatest(FETCH_NOTIFICATION, notification)
}