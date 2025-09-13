import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000/api", // sua API Laravel, por ex.
})

export default api
