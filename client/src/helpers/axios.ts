import axios from 'axios'
import { axiosConfig } from '../configs'

const axiosInstance = axios.create({
  baseURL: axiosConfig.baseURL,
  timeout: axiosConfig.timeout,
  headers: axiosConfig.headers,
})

export default axiosInstance
