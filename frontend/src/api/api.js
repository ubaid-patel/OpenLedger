import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://open-ledger-api.vercel.app/api"
    : "http://127.0.0.1:8001/api"
})

export default API