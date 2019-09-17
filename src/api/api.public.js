import { Post } from "../services/http.service"
import {
    GENERATE_OTP, VERIFY_OTP
} from "../constants/api.constant"

class PublicApi {
    static generateOTP = (mobile) => {
        return Post({ url: GENERATE_OTP, body: { mobile } });
    }

    static verifyOTP = (mobile, otp) => {
        return Post({ url: VERIFY_OTP, body: { mobile, otp } });
    }
}

export default PublicApi;