export default {
  install(Vue) {
    Vue.prototype.truncate = (str, length = 30) => {
      if (str) {
        if (str.length < length) {
          return str
        } else {
          return str.substring(0, length) + '...'
        }
      } else {
        return str
      }
    }
  }
}
