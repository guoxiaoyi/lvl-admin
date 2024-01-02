import request from '@/utils/request'
export function get(params) {
  return request({
    url: `/lmp/v2/admin/fleeing_notify`,
    method: 'get'
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/fleeing_notify`,
    method: 'put',
    data
  })
}

export default { get, edit }
