import { Put, Get, Post, Delete } from "../services/http.service"
import { USER, BLOOD_REQUIREMENT, ACCEPT_BLOOD_REQUIREMENT, BLOOD_REQUIREMENT_DONERS, GOT_BLOOD, FIND_USER, NOTIFICATION, REQUEST, CAMP, JOIN_CAMP, POST, LIKE_POST, UNLIKE_POST, COMMENT_POST } from "../constants/api.constant"

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

    static getBloodRequirement = (id) => {
        return Get({ url: `${BLOOD_REQUIREMENT}/${id}` });
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

    static getAllCamps = () => {
        return Get({ url: CAMP });
    }

    static joinCamp = (id) => {
        return Post({ url: JOIN_CAMP, body: { id } })
    }

    static createPost = (params) => {
        return Post({ url: POST, body: params })
    }

    static likePost = (id) => {
        return Post({ url: `${POST}/${id}/${LIKE_POST}` });
    }

    static unlikePost = (id) => {
        return Post({ url: `${POST}/${id}/${UNLIKE_POST}` });
    }

    static commentPost = (id) => {
        return Post({ url: `${POST}/${id}/${COMMENT_POST}` });
    }

    static getAllPost = (all = false) => {
        let url = POST;

        if (all) {
            url = `${POST}?all=true`;
        }

        return Get({ url });
    }
}

export default PrivateApi;