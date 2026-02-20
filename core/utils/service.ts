import axios from 'axios'
import { logout } from '~/app/actions'
import { ObjectTransform } from './format-case'

export const api = axios.create({
  baseURL: '/api/proxy',
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (request) => {
    if (request.params) {
      if (typeof request.params?.page !== 'undefined') request.params.page = request.params.page + 1
      request.params = ObjectTransform.camelToSnake(request.params)
    }
    if (request.data) request.data = ObjectTransform.camelToSnake(request.data)
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    if (response.data) response.data = ObjectTransform.snakeToCamel(response.data)
    return response
  },
  async (error) => {
    if (error.response.status === 401) {
      await logout()
      window.location.reload()
    }
    return Promise.reject(error)
  },
)

export const local = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
