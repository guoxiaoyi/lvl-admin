import request from '@/utils/request'
export function get(params) {
  return request({
    url: `/lmp/v2/admin/freight`,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/freight`,
    method: 'put',
    data
  })
}

export default { get, edit }
