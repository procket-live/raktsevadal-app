import { Post } from "../services/http.service"
import {
    GENERATE_OTP, VERIFY_OTP, TRUECALLER_LOGIN
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
}

export default PublicApi;