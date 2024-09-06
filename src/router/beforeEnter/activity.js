import store from '@/store'
export const activityBeforeEnter = async(to, from, next) => {
  await store.dispatch('apiData/fetchData', { id: to.params.activityId }).then(data => {
    if (data.type === 'AntiFakeActivity' && to.name !== `Anti${to.name}`) {
      next({ name: `Anti${to.name}`, params: to.params })
    } else {
      next()
    }
  })
  next()
}

export default { activityBeforeEnter }
