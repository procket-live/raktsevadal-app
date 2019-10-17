import { FETCH_NEARBY_REQUEST, SET_NEARBY_REQUEST, SET_NEARBY_REQUEST_LOADING } from "../constants/redux.constant";

export const fetchNearbyRequest = () => ({
    type: FETCH_NEARBY_REQUEST
})

export const setNearbyRequest = (payload) => ({
    type: SET_NEARBY_REQUEST,
    payload
})

export const setNearbyRequestLoading = (payload) => ({
    type: SET_NEARBY_REQUEST_LOADING,
    payload
})