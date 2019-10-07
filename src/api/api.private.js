import { Put, Get, Post, Delete } from "../services/http.service"
import { USER, BLOOD_REQUIREMENT, ACCEPT_BLOOD_REQUIREMENT, BLOOD_REQUIREMENT_DONERS, GOT_BLOOD, FIND_USER, NOTIFICATION, REQUEST } from "../constants/api.constant"

class PrivateApi {
    static updateUser = (body) => {
        return Put({ url: USER, body, hideMessage: true });
    }

    static getUser = () => {
        return Get({ url: USER });
    }

    static addBloodRequirement = (body) => {
        return Post({ url: BLOOD_REQUIREMENT, body })
    }

    static fetchBloodRequirements = (query) => {
        return Get({ url: `${BLOOD_REQUIREMENT}?${query}` });
    }

    static acceptBloodDonationRequest = (id) => {
        return Post({ url: `${ACCEPT_BLOOD_REQUIREMENT}/${id}` });
    }

    static getBloodDonationRequestDoners = (id) => {
        return Get({ url: `${BLOOD_REQUIREMENT_DONERS}/${id}` });
    }

    static gotBlood = (id) => {
        return Post({ url: `${GOT_BLOOD}/${id}` });
    }

    static removeBloodDonationReqest = (id) => {
        return Delete({ url: `${BLOOD_REQUIREMENT}/${id}` });
    }

    static findUser = (query) => {
        return Get({ url: `${FIND_USER}?${query}` });
    }

    static getNotifications = () => {
        return Get({ url: NOTIFICATION })
    }

    static request = (body) => {
        return Post({ url: REQUEST, body })
    }
}

export default PrivateApi;