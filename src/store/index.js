import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import breadcrumb from './modules/breadcrumb'
import apiData from './modules/activities'
import userTag from './modules/userTag'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    breadcrumb,
    apiData,
    userTag
  },
  getters
})

export default store
