import { FETCH_NEARBY_CAMP, SET_NEARBY_CAMP, SET_NEARBY_CAMP_LOADING } from "../constants/redux.constant";

export const fetchNearbyCamp = () => ({
    type: FETCH_NEARBY_CAMP,
})

export const setNearbyCamp = (payload) => ({
    type: SET_NEARBY_CAMP,
    payload
})

export const setNearbyCampLoading = (payload) => ({
    type: SET_NEARBY_CAMP_LOADING,
    payload
})