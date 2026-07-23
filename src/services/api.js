import axios from "axios"
import router from "@/router"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor de request — adiciona token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

// Interceptor de response — trata 401 globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")

      if (router.currentRoute?.value?.name !== "login") {
        router.push({ name: "login" })
      }
    }

    return Promise.reject(error)
  }
)

export default api
