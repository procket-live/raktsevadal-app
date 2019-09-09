import { SET_USER } from "../constants/redux.constant";

const DEFAULT_STATE = null;

function userReducer(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SET_USER:
            return action.user;
        default:
            return state;
    }
}

export default userReducer;