import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { requestInterceptor, requestErrorInterceptor } from './interceptors.request'
import { responseInterceptor, responseErrorInterceptor } from './interceptors.response'

export type HttpClient = AxiosInstance

export const ApiInstance = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  headers: {
    'Content-Type': 'application/json',
  },
})

ApiInstance.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
)

ApiInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
)