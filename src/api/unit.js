import request from '@/utils/request'
import qs from 'qs'
export function batch_destroy(data) {
  return request({
    url: '/lmp/v2/admin/unit/batch_destroy?' + qs.stringify(data, { indices: false }),
    method: 'delete'
  })
}
export function batch_enabled(data) {
  return request({
    url: '/lmp/v2/admin/unit/batch_enabled?' + qs.stringify(data, { indices: false }),
    method: 'put'
  })
}

export default { batch_destroy, batch_enabled }
