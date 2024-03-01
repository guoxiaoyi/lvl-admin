/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
import { getToken } from './auth'
import { Message } from 'element-ui'
function downloadDebounce(func, wait) {
  let timeout
  return function(...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}
export default {
  install(Vue) {
    Vue.prototype.downloadFile = downloadDebounce((url, filename) => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': getToken()
        }
      }).then(response => {
        if (!response.ok) throw new Error('网络响应不是ok状态')
        const contentDisposition = response.headers.get('Content-Disposition')
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
          if (filenameMatch && filenameMatch[1]) {
            filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, '')) // Use server-suggested filename if available
          }
        }
        return response.blob()
      }).then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename || 'downloaded_file'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }).catch(() => Message.error('下载时发生错误'))
    }, 500)
  }
}
