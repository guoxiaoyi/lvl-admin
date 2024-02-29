import axios from 'axios'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
// create an axios instance

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

axios.defaults.retry = 1
axios.defaults.retryDelay = 10000

// service.defaults.headers.post['Content-Type'] = 'multipart/form-data'
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    config.headers['Authorization'] = Cookies.get('admin_token')
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.config.url.split('/').includes('lgp')) {
      return res
    }
    if (res.code !== 0) {
      if (response.data.error) {
        response.data.error.forEach((element, index) => {
          setTimeout(() => {
            Message({
              message: `${element.message}`,
              type: 'error',
              duration: 5 * 1000
            })
          }, 100 * index)
        })
      } else {
        Message({
          message: response.data.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  async error => {
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Message({
        message: '网络超时',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      if (error.response.status === 401) {
        await Cookies.remove('admin_token')
        window.location.href = '/lmp/portal/admin/sign_in'
      }
      if (error.response.status === 403) {
        // window.location.href = '/admin'
      }
      if (error.response.status === 503) {
        window.location.href = '/html/503.html'
      }
      const msg = error.response.data.message || '请求失败'
      Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)
export default service
