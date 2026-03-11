import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.PROD
    ? "/api"
    : "http://10.97.92.55:8000/api"
})

export default API