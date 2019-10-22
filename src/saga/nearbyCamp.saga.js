import { call, put, takeLatest, select } from 'redux-saga/effects';
import { FETCH_NEARBY_CAMP } from "../constants/redux.constant";
import PrivateApi from '../api/api.private';
import { AccessNestedObject, DistanceBetweenLatLng } from '../utils/common.util';
import { setNearbyCamp, setNearbyCampLoading } from '../action/nearbyCamp.action';

const getUser = (state) => AccessNestedObject(state, 'user');

function* nearbyCamp() {
    const user = yield select(getUser)
    const latitude = AccessNestedObject(user, 'latest_location.coordinates.0', 0.0)
    const longitude = AccessNestedObject(user, 'latest_location.coordinates.1', 0.0)

    yield put(setNearbyCampLoading(true))
    const result = yield call(PrivateApi.getAllCamps);
    yield put(setNearbyCampLoading(false))
    if (result.success) {
        const camps = AccessNestedObject(result, 'response', [])
            .map((item) => {
                const reqLatitude = AccessNestedObject(item, 'location.coordinates.0');
                const reqLongitude = AccessNestedObject(item, 'location.coordinates.1');

                item.distance = DistanceBetweenLatLng(latitude, longitude, reqLatitude, reqLongitude);
                return item;
            })
            .sort((a, b) => (a.distance > b.distance) ? 1 : -1)

        console.log(
            'camps', camps
        )
        yield put(setNearbyCamp(camps));
    }
}

export default function* () {
    yield takeLatest(FETCH_NEARBY_CAMP, nearbyCamp)
}