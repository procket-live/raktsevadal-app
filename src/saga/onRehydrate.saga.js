// persist/REHYDRATE

import { select, takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/es/constants';
import APP from '../constants/app.constant';
import { AccessNestedObject } from '../utils/common.util';

const getUserToken = state => AccessNestedObject(state, 'user.token');

function* rehydrate() {
    const token = yield select(getUserToken);
    APP.TOKEN = token;
}

export default function* () {
    yield takeLatest(REHYDRATE, rehydrate)
}