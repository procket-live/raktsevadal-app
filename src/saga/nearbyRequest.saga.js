import { call, put, takeLatest, select } from 'redux-saga/effects';
import { FETCH_NEARBY_REQUEST } from "../constants/redux.constant";
import PrivateApi from '../api/api.private';
import { AccessNestedObject, JSONToQuery, DistanceBetweenLatLng, AmIDoner } from '../utils/common.util';
import { setNearbyRequestLoading, setNearbyRequest } from '../action/nearbyRequest.action';
import DONATION_MAP from '../constants/donation.constant';

const getUser = (state) => AccessNestedObject(state, 'user');

function* myRequest(action) {
    yield put(setNearbyRequestLoading(true))

    const user = yield select(getUser)

    const userId = AccessNestedObject(user, '_id');
    const myBloodGroup = AccessNestedObject(user, 'blood_group');
    const iCanDonate = AccessNestedObject(DONATION_MAP, `${myBloodGroup}.donate`, '').map((bg) => bg.replace('+', 'p').replace('-', 'n')).join(',');
    const range = AccessNestedObject(action, 'range');
    const latitude = AccessNestedObject(user, 'latest_location.coordinates.0', 0.0)
    const longitude = AccessNestedObject(user, 'latest_location.coordinates.1', 0.0)

    const params = {
        blood_group: iCanDonate,
        latitude,
        longitude,
        not_created_by: userId,
        range
    }
    console.log('params', params);

    const query = JSONToQuery(params);
    const result = yield call(PrivateApi.fetchBloodRequirements, query);
    yield put(setNearbyRequestLoading(false))
    if (result.success) {
        let list = AccessNestedObject(result, 'response', []);

        list = list
            .map((item) => {
                const reqLatitude = AccessNestedObject(item, 'hospital_location.coordinates.0');
                const reqLongitude = AccessNestedObject(item, 'hospital_location.coordinates.1');

                item.distance = DistanceBetweenLatLng(latitude, longitude, reqLatitude, reqLongitude);
                item.amIDoner = AmIDoner(userId, AccessNestedObject(item, 'doners', []));
                return item;
            })
            .sort((a, b) => (a.distance > b.distance) ? 1 : -1)

        list = list.length ? [1, ...list] : [];

        yield put(setNearbyRequest(list))
    }
}

export default function* () {
    yield takeLatest(FETCH_NEARBY_REQUEST, myRequest)
}