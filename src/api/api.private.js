import { Put, Get, Post } from "../services/http.service"
import { USER, BLOOD_REQUIREMENT, ACCEPT_BLOOD_REQUIREMENT } from "../constants/api.constant"

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
}

export default PrivateApi;