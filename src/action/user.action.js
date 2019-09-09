import { SET_USER } from "../constants/redux.constant";

export function SetUserAction(user) {
    return {
        type: SET_USER,
        user
    }
}