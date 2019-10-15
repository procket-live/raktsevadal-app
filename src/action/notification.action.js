import { FETCH_NOTIFICATION, SET_NOTIFICATION, SET_NOTIFICATION_LOADING } from "../constants/redux.constant";

export const fetchNotifications = () => ({
    type: FETCH_NOTIFICATION
})

export const setNotifications = (payload) => ({
    type: SET_NOTIFICATION,
    payload
})

export const setNotificationLoading = (payload) => ({
    type: SET_NOTIFICATION_LOADING,
    payload
})