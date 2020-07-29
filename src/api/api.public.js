import { Post, Get } from "../services/http.service"
import {
    GENERATE_OTP, VERIFY_OTP, TRUECALLER_LOGIN, GET_APP_VERSION
} from "../constants/api.constant"

class PublicApi {
    static generateOTP = (mobile) => {
        return Post({ url: GENERATE_OTP, body: { mobile } });
    }

    static verifyOTP = (mobile, otp) => {
        return Post({ url: VERIFY_OTP, body: { mobile, otp } });
    }

    static truecallerLogin = (profile, mobile) => {
        return Post({ url: TRUECALLER_LOGIN, body: { profile, mobile } })
    }

    static getLatestVersion = () => {
        return Get({ url: GET_APP_VERSION })
    }
}

export default PublicApi;