/**
 * @param {Str} str
 * @returns {Str}
 * @example see @/views/permission/directive.vue
 */
export default {
  install(Vue) {
    Vue.prototype.var2LowerCase = (str) => {
      return str.replace(/(_[a-z])/g, match => {
        return match.toUpperCase().replace('_', '')
      })
    }
    Vue.prototype.camelToSnake = (str) => {
      if (str) {
        return `${str.charAt(0).toLowerCase()}${str.slice(1)}`.replace(/([A-Z])/g, '_$1').toLowerCase()
      } else {
        return ''
      }
    }
  }
}
