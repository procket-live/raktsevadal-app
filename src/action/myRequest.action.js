import { FETCH_MY_REQUEST, SET_MY_REQUEST, SET_MY_REQURST_LOADING } from "../constants/redux.constant";

export const fetchMyRequest = () => ({
    type: FETCH_MY_REQUEST
})

export const setMyRequest = (payload) => ({
    type: SET_MY_REQUEST,
    payload
})

export const setMyRequestLoading = (payload) => ({
    type: SET_MY_REQURST_LOADING,
    payload
})