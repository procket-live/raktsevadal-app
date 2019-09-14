import { put, takeLatest } from 'redux-saga/effects';
import { LOGOUT_USER } from "../constants/redux.constant";
import { setUserAction } from "../action/user.action";

function* logoutUser() {
    yield put(setUserAction(null));
}

export default function* () {
    yield takeLatest(LOGOUT_USER, logoutUser)
}