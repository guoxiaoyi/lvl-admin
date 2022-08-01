import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '../router/index.js'
import user from '@/api/user'
// import { getToken } from '@/utils/auth'

// create an axios instance

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

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
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0) {
      let messages = ''
      if (response.data.errInfo) {
        messages = response.data.errInfo.map( m => m.value).join(',')
      } else {
        messages = response.data.message
      }

      Message({
        message: messages,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Message({
        message: '网络超时',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      if(error.response.status === 401) {
        user.logout().then(response => {
          window.location.href = '/admin/sign_in/'
        })
      }
      if(error.response.status === 403) {
        window.location.href = '/admin'
      }
      const msg = error.response.data.message
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
