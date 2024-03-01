import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueAppend from 'vue-append'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import VueMeta from 'vue-meta'
import ElementUI from 'element-ui'
import CustomDatePicker from '@/components/CustomDatePicker/index.vue'
import Cookies from 'js-cookie'
Cookies.remove('token')
// import 'element-ui/lib/theme-chalk/index.css'

import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import activityI18n from './locale/activity.zh-CN' // lang i18n
import commonsI18n from './locale/commons.zh-CN' // lang i18n
import pageI18n from './locale/page.zh-CN' // lang i18n
import wechatProfileI18n from './locale/wechat_profile.zh-CN' // lang i18n
import unitI18n from './locale/unit.zh-CN' // lang i18n
import jquery from 'jquery'
import '@/assets/lifanli-font.scss'
import '@/assets/index.css'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import checkPer from '@/utils/permission'
import toPrice from '@/utils/formatPrice'
import downloadFile from '@/utils/downloadFile'
import var2LowerCase from '@/utils/var2LowerCase'
import elPickerOptions from '@/utils/elPickerOptions'
import truncate from '@/utils/truncate'

import '@/permission' // permission control
// import './menu'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
const { mockXHR } = require('../mock')
mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, { locale, size: 'small' })

Vue.prototype.map_picture = (lat, lon, size = '400*200') => {
  return `https://apis.map.qq.com/ws/staticmap/v2/?center=${lat},${lon}&zoom=15&size=${size}&maptype=roadmap&markers=size:large|${lat},${lon}&key=${process.env.VUE_APP_QQ_MAP}`
}

Vue.prototype.qq_map_url = (lat, lon, name, addr) => {
  return `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lon};title:${name};addr:${addr ? '-' : addr}&referer=lifanli`
}
Vue.prototype.$Map = window.TMap

Vue.prototype.$ = jquery
Vue.config.productionTip = false
Vue.use(checkPer)
Vue.use(toPrice)
Vue.use(downloadFile)
Vue.use(var2LowerCase)
Vue.use(elPickerOptions)
Vue.use(truncate)
Vue.use(VueAppend)
Vue.use(VueI18n)
Vue.use(VueMeta)
const i18n = new VueI18n({
  locale: 'zh-CN', // 设置地区
  messages: {
    'zh-CN': {
      ...activityI18n,
      ...commonsI18n,
      ...pageI18n,
      ...wechatProfileI18n,
      ...unitI18n
    }
  }
})
Vue.component('custom-date-picker', CustomDatePicker)
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
