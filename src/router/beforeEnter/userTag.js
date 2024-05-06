import store from '@/store'
export const userTagBeforeEnter = async(to, from, next) => {
  await store.dispatch('userTag/fetchData', { id: to.params.id }).then(data => {
  })
  next()
}

export default { userTagBeforeEnter }
