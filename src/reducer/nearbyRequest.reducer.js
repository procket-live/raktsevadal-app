import { SET_NEARBY_REQUEST_LOADING, SET_NEARBY_REQUEST } from "../constants/redux.constant";

const DEFAULT_STATE = {
    nearbyRequests: [1, 2, 3, 4],
    loading: false
};

export default function (state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SET_NEARBY_REQUEST_LOADING:
            return { ...state, loading: action.payload };
        case SET_NEARBY_REQUEST:
            return { ...state, nearbyRequests: action.payload };
        default:
            return state;
    }
}
