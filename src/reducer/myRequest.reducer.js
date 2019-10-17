import { SET_MY_REQUEST, SET_MY_REQURST_LOADING } from "../constants/redux.constant";

const DEFAULT_STATE = {
    myRequests: [],
    loading: false
};

export default function (state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SET_MY_REQURST_LOADING:
            return { ...state, loading: action.payload };
        case SET_MY_REQUEST:
            return { ...state, myRequests: action.payload };
        default:
            return state;
    }
}
