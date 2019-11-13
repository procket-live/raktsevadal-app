import { FETCH_NOTIFICATION, SET_NOTIFICATION, SET_NOTIFICATION_LOADING, SET_NOTIFICATION_SEEN_COUNT } from "../constants/redux.constant";

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

export const setNotificationSeenCount = (payload) => ({
    type: SET_NOTIFICATION_SEEN_COUNT,
    payload
})