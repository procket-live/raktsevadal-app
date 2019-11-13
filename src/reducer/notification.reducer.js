import { SET_NOTIFICATION_LOADING, SET_NOTIFICATION, SET_NOTIFICATION_SEEN_COUNT } from "../constants/redux.constant";

const DEFAULT_STATE = {
    notifications: [],
    loading: false,
    seenSoFar: 0
};

export default function (state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SET_NOTIFICATION_LOADING:
            return { ...state, loading: action.payload };
        case SET_NOTIFICATION:
            return { ...state, notifications: action.payload };
        case SET_NOTIFICATION_SEEN_COUNT:
            return { ...state, seenSoFar: action.payload };
        default:
            return state;
    }
}
