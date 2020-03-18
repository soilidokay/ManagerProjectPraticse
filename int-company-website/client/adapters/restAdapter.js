import axios from 'axios'
import getConfig from 'next/config'
import Cookies from 'js-cookie'
import ApplicationError from '../services/ApplicationError'

const { publicRuntimeConfig } = getConfig()
const API_BASE_URL = `${publicRuntimeConfig.BASE_URL}/api`

const instance = axios.create({ baseURL: API_BASE_URL })

instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (err) {
    if (err.message === 'Network Error') {
      err.code = ApplicationError.ERR_NETWORK_ERROR
      err.message = 'errNetwork'
    }
    return Promise.reject(err)
  }
)

/**
 * On browser, restAdapter (axios) doesn't need to care about access_token anymore as we hacked around to let server set
 * access_token to browser on successful login.
 * @param token
 */
instance.setAccessToken = function (token) {
  if (token) {
    instance.defaults.headers['access_token'] = token
  } else {
    delete instance.defaults.headers.access_token
  }
}

instance.removeAccessToken = function () {
  delete instance.defaults.headers.access_token
  Cookies.remove('access_token')
}

export default instance
