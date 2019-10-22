import { SET_NEARBY_CAMP, SET_NEARBY_CAMP_LOADING } from "../constants/redux.constant";

const DEFAULT_STATE = {
    camps: [],
    loading: false
};

export default function (state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SET_NEARBY_CAMP_LOADING:
            return { ...state, loading: action.payload };
        case SET_NEARBY_CAMP:
            return { ...state, camps: action.payload };
        default:
            return state;
    }
}
