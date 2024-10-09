import Cookies from 'js-cookie'
import { menus } from '@/api/menu'

const state = {
  sidebar: {
    opened: Cookies.get('menu_open') !== 'false',
    withoutAnimation: false
  },
  helpCenter: false,
  menus: {},
  device: 'desktop'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('menu_open', true)
    } else {
      Cookies.set('menu_open', false)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('menu_open', false)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  TOGGLE_HELP_CENTER: (state, data) => {
    state.helpCenter = data
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  toggleHelpCenter({ commit }, data) {
    commit('TOGGLE_HELP_CENTER', data)
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  menus({ commit }) {
    return new Promise((resolve, reject) => {
      menus().then(response => {
        commit('SET_MENUS', response.data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
