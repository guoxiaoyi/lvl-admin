import request from '@/utils/request'
export function get(params) {
  return request({
    url: `/lmp/v2/admin/fleeing/${params.id}`,
    method: 'get'
  })
}
export function download(params) {
  return request({
    url: `/lmp/v2/admin/fleeing/export`,
    method: 'get'
  })
}

export default { get, download }
