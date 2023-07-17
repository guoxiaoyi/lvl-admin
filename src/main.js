import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

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
import elPickerOptions from '@/utils/elPickerOptions'

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
Vue.use(elPickerOptions)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
