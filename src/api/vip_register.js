import request from '@/utils/request'
export function get(params) {
  return request({
    url: `/lmp/v2/admin/vip_register/${params.id}`,
    method: 'get'
  })
}
export function update_state(data) {
  return request({
    url: `/lmp/v2/admin/vip_register/${data.id}/update_state`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data.state)
  })
}

export default { get, update_state }
