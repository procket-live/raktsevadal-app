import { call, put, takeLatest, select } from 'redux-saga/effects';
import { FETCH_MY_REQUEST } from "../constants/redux.constant";
import PrivateApi from '../api/api.private';
import { AccessNestedObject, JSONToQuery, DistanceBetweenLatLng } from '../utils/common.util';
import { setMyRequestLoading, setMyRequest } from '../action/myRequest.action';

const getUser = (state) => AccessNestedObject(state, 'user');

function* myRequest() {
    yield put(setMyRequestLoading(true))
    const user = yield select(getUser);
    const userId = AccessNestedObject(user, '_id');
    const latitude = AccessNestedObject(user, 'latest_location.coordinates.0', 0.0)
    const longitude = AccessNestedObject(user, 'latest_location.coordinates.1', 0.0)

    const params = {
        created_by: userId
    }
    const query = JSONToQuery(params);
    const result = yield call(PrivateApi.fetchBloodRequirements, query);
    yield put(setMyRequestLoading(false))

    if (result.success) {
        const list = AccessNestedObject(result, 'response', [])
            .reverse()
            .map((item) => {
                const reqLatitude = AccessNestedObject(item, 'hospital_location.coordinates.0');
                const reqLongitude = AccessNestedObject(item, 'hospital_location.coordinates.1');

                item.distance = DistanceBetweenLatLng(latitude, longitude, reqLatitude, reqLongitude);
                return item;
            });
        yield put(setMyRequest(list))
    }
}

export default function* () {
    yield takeLatest(FETCH_MY_REQUEST, myRequest)
}