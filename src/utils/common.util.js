import Share from 'react-native-share';
import { Linking } from 'react-native';
import DONATION_MAP from '../constants/donation.constant';
import NotifyService from '../services/notify.service';
import { PLAYSTORE } from '../constants/app.constant';

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

    return (query);
}

export function DistanceBetweenLatLng(lat1, lon1, lat2, lon2, unit) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return parseFloat(d).toFixed(2);
}

function toRad(Value) {
    return Value * Math.PI / 180;
}

export function ShareOnWhatsapp(bloodDonationRequirement) {
    const patientName = AccessNestedObject(bloodDonationRequirement, 'patient_name');
    const age = AccessNestedObject(bloodDonationRequirement, 'patient_age');
    const units = AccessNestedObject(bloodDonationRequirement, 'blood_unit');
    const bloodGroup = AccessNestedObject(bloodDonationRequirement, 'blood_group');
    const canDonate = DONATION_MAP[bloodGroup].receive;
    const hospitalName = AccessNestedObject(bloodDonationRequirement, 'hospital_name');
    const hospitalAddress = AccessNestedObject(bloodDonationRequirement, 'hospital_address');
    const contactPersonName = AccessNestedObject(bloodDonationRequirement, 'contact_person_name');
    const contactNumber = AccessNestedObject(bloodDonationRequirement, 'contact_person_mobile');

    const options = {
        url: `http://www.raktsevadal.com/blood-requirement/${bloodDonationRequirement._id}`,
        message: `${patientName}, age ${age} requires ${units} unit(s) of ${bloodGroup} in ${hospitalName}. Hospital address is ${hospitalAddress}. \n \n Doners from blood group ${canDonate} \n \n \n to contact click below. \n \n Contact Person Name: ${contactPersonName} \n Contact Number: ${contactNumber}`
    }

    Share.open(options)
}

export function ShareApp() {
    const options = {
        title: "Rakt Sevadal",
        url: PLAYSTORE,
        message: 'Download rakt sevadal to find blood doners in your locality and donate blood to needy.'
    }

    Share.open(options)
}

export function AmIDoner(userId, doners = []) {
    let found = false;

    doners.forEach((doner) => {
        if (doner.user == userId) {
            found = true;
        }
    })

    return found;
}

export function Call(mobile) {
    Linking.openURL(`tel:${mobile}`)
}