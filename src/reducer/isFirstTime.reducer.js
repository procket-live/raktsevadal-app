import { SET_IS_FIRST_TIME } from "../constants/redux.constant";

const DEFAULT_STATE = true;

export default function (state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SET_IS_FIRST_TIME:
            return action.payload;
        default:
            return state;
    }
}
