import { serverUrl } from "../const/const";
import { getToken } from "./Storage";

export const getProfile = async () => {
    const token = await getToken();
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    try {
        const res = await fetch(`${serverUrl}/api/user/me`, options)
        const data = await res.json()
        return data.user;
    } catch (error) {
        console.log("getProfile:", error);
        return null;
    }
}
