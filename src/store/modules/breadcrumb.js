const state = {
  list:  [],
  buttons: [],
  activeButton: ''
}

const mutations = {
  SET_BREADCRUMB: (state, data) => {
    state.list = data
  },
  SET_BREADCRUMB__BUTTON: (state, data) => {
    state.buttons = data
  },
  SET_ACTIVE__BUTTON: (state, data) => {
    state.activeButton = data
  }
}

const actions = {
  set_breadcrumb({ commit }, data) {
    commit('SET_BREADCRUMB', data)
  },
  set_breadcrumb__buttons({ commit }, data) {
    commit('SET_BREADCRUMB__BUTTON', data)
  },
  set_active__button({ commit }, data) {
    commit('SET_ACTIVE__BUTTON', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
