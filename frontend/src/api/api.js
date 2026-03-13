import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://open-ledger-api.vercel.app/api"
    : "https://open-ledger-api.vercel.app/api"
})

export default API