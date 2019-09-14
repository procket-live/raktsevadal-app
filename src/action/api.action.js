import { API_START, API_END, ACCESS_DENIED, API_ERROR } from "../constants/redux.constant";

export const apiStart = label => ({
    type: API_START,
    label
})

export const apiEnd = label => ({
    type: API_END,
    label
})

export const accessDenied = url => ({
    type: ACCESS_DENIED,
    payload: {
        url
    }
})

export const apiError = error => ({
    type: API_ERROR,
    error
})
