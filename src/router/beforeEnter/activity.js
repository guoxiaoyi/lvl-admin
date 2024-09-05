import store from '@/store'
export const activityBeforeEnter = async(to, from, next) => {
  await store.dispatch('apiData/fetchData', { id: to.params.activityId }).then(data => {
  })
  console.log(store.getters.activityData.type)
  next()
}

export default { activityBeforeEnter }
