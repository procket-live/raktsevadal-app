import { FETCH_NEARBY_REQUEST, SET_NEARBY_REQUEST, SET_NEARBY_REQUEST_LOADING } from "../constants/redux.constant";

export const fetchNearbyRequest = (range = 50) => ({
    type: FETCH_NEARBY_REQUEST,
    range
})

export const setNearbyRequest = (payload) => ({
    type: SET_NEARBY_REQUEST,
    payload
})

export const setNearbyRequestLoading = (payload) => ({
    type: SET_NEARBY_REQUEST_LOADING,
    payload
})