// store/modules/apiData.js
import activities from '@/api/activities'
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
        activities.show({ ...params }).then(({ data }) => {
          resolve(data)
          commit('setData', data)
        }).catch(fail => {
          reject(fail)
        })
      })
    }
  }
}
