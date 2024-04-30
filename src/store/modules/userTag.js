// store/modules/apiData.js
import user_tag_auto from '@/api/user_tag_auto.js'
export default {
  namespaced: true,
  state: {
    data: {}
  },
  mutations: {
    setData(state, payload) {
      state.data = payload
    }
  },
  actions: {
    fetchData({ commit }, params) {
      return new Promise((resolve, reject) => {
        user_tag_auto.show({ ...params }).then(({ data }) => {
          resolve(data)
          commit('setData', data)
        }).catch(fail => {
          reject(fail)
        })
      })
    }
  }
}
