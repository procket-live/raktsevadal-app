/*
 * find a nested object property inside of an object.
 * @param  {array} path
 * @param  {object} obj
 */
export function AccessNestedObject(obj, path, valueNotFound = undefined) {
    if (!((Array.isArray(path) || ((typeof path == 'string') || (typeof path == 'number'))) && obj && typeof obj == 'object')) {
        return valueNotFound;
    }

    if (typeof path == 'number') {
        path = String(path);
    }

    if (typeof path == 'string') {
        path = path.split('.');
    }

    return path.reduce((xs, x) => (xs && xs[x] != undefined) ? xs[x] : valueNotFound, obj)
}

export function IsCorrectMobileNumber(mobile) {
    return /^((\+){1}91){1}[1-9]{1}[0-9]{9}$/.test(mobile.replace(' ', ''));
}

export function JSONToQuery(params) {
    let query = '';

    Object.keys(params).forEach((key) => {
        query += `${query == '' ? '' : '&'}${key}=${params[key]}`;
    })

    return query;
}