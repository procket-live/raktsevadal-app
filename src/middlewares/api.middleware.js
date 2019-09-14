import axios from 'axios';
import { API } from '../constants/redux.constant';
import { accessDenied, apiError, apiStart, apiEnd } from '../action/api.action';
import { BASE_URL } from '../constants/app.constant';
import { logoutUserAction } from '../action/user.action';

const apiMiddleware = ({ dispatch }) => next => action => {
    next(action);

    if (action.type != API) return;

    const {
        url,
        method,
        data,
        accessToken,
        onSuccess,
        onFailure,
        label,
        headers
    } = action.payload;

    const dataOrParams = ['GET', 'DELETE'].includes(method) ? 'params' : 'data';

    axios.defaults.baseURL = BASE_URL;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    if (label) {
        dispatch(apiStart(label));
    }

    axios
        .request({
            url,
            method,
            headers,
            [dataOrParams]: data
        })
        .then(({ data }) => {
            dispatch(onSuccess(data));
        })
        .catch(error => {
            dispatch(apiError(error));
            dispatch(onFailure(error));

            if (error.response && error.response.status === 403) {
                dispatch(logoutUserAction());
            }
        })
        .finally(() => {
            if (label) {
                dispatch(apiEnd(label));
            }
        });
}

export default apiMiddleware;