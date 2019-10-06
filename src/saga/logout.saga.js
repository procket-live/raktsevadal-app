import { put, takeLatest } from 'redux-saga/effects';
import { LOGOUT_USER, CLEAR_USER } from "../constants/redux.constant";
import { resetToScreen } from '../services/navigation.service';

function* logoutUser() {
    yield put({ type: CLEAR_USER });
    resetToScreen('ResolveApp');
}

export default function* () {
    yield takeLatest(LOGOUT_USER, logoutUser)
}