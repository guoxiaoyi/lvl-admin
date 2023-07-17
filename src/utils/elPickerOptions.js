/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
import moment from 'moment'
export default {
  install(Vue) {
    Vue.prototype.elPickerOptions = (value) => {
      return {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'), moment().subtract(1, 'day').format('YYYY-MM-DD 23:59:59')])
            }
          },
          {
            text: '最近7天',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
            }
          },
          {
            text: '最近30天',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(30, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
            }
          }
        ]
      }
    }
  }
}
