import axios from 'axios'
import { axiosConfig } from '../configs'

const axiosInstance = axios.create({
  baseURL: axiosConfig.baseURL,
  timeout: axiosConfig.timeout,
  headers: axiosConfig.headers,
})

axiosInstance.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  async (response) => {
    return response.data
  },
  async (error) => {
    let errorCode = 5001

    const code = error.response && Number(error.response.status)

    switch (code) {
      case 400:
        errorCode = error.response.data.code
        break
      case 401:
        errorCode = error.response.data.code
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
