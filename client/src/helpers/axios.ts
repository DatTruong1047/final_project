import axios from 'axios'
import { authRoute, axiosConfig } from '../configs'
import { useAuthStore } from '../stores/authStore'
import { refreshToken } from '@/api'
import { ErrorCodes } from '@/configs/errorConfig'

const axiosInstance = axios.create({
  baseURL: axiosConfig.baseURL,
  timeout: axiosConfig.timeout,
  headers: axiosConfig.headers,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => response.data || response,
  async (error) => {
    const originalRequest = error.config
    let errorCode = 5001
    const code = error.response && Number(error.response.status)
    console.log('Error response', error)
    switch (code) {
      case 400:
        errorCode = error.response.data.code
        break
      case 401:
        errorCode = error.response.data.code
        if (!originalRequest._retry) {
          originalRequest._retry = true
          const authStore = useAuthStore()

          try {
            const response: { data: { accessToken: string; refreshToken: string } } =
              await refreshToken({ refreshToken: authStore.refreshToken })

            const { accessToken } = response.data
            authStore.setAccessToken(accessToken)

            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return axiosInstance(originalRequest)
          } catch (refreshError: any) {
            authStore.logout()
            return Promise.reject(ErrorCodes.UNAUTHORIZED)
          }
        }
        break
      case 403:
        errorCode = error.response.data.code
        break
      case 404:
        errorCode = error.response.data.code
        break
      case 409:
        errorCode = error.response.data.code
        break
      case 429:
        errorCode = error.response.data.code
        break
      case 500:
        errorCode = error.response.data.code
        break
      default:
        break
    }

    throw errorCode
  },
)

export default axiosInstance
