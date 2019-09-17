import { Put, Get } from "../services/http.service"
import { USER } from "../constants/api.constant"

class PrivateApi {
    static updateUser = (body) => {
        return Put({ url: USER, body });
    }

    static getUser = () => {
        return Get({ url: USER });
    }
}

export default PrivateApi;