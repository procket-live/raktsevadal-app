import { SET_USER, LOGOUT_USER } from "../constants/redux.constant";

export const setUserAction = user => ({
    type: SET_USER,
    user
})

export const logoutUserAction = () => ({
    type: LOGOUT_USER
})