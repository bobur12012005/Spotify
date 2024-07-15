import axios from "axios"
const token = localStorage.getItem('token')

export default class ApiHandler {
    constructor(url) {
        this.url = url
    }

    async getData(resource) {
        try {
            const res = await axios.get(this.url + resource, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data
        } catch (e) {
            return {
                message: e.message
            }
        }
    }
}