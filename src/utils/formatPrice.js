/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default {
  install(Vue) {
    Vue.prototype.toPrice = (value) => {
      if (!parseFloat(value)) {
        return '0.00'
      } else {
        console.log(value)
        return value.toFixed(2)
      }
    }
  }
}
