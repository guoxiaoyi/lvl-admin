import request from '@/utils/request'

export function batch_destroy(data) {
  return request({
    url: '/lmp/v2/admin/unit/batch_destroy',
    method: 'delete',
    data
  })
}
export function batch_enabled(data) {
  return request({
    url: '/lmp/v2/admin/unit/batch_enabled',
    method: 'put',
    data
  })
}

export default { batch_destroy, batch_enabled }
