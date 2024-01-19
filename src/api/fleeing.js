import request from '@/utils/request'
import qs from 'qs'
export function get(params) {
  return request({
    url: `/lmp/v2/admin/fleeing/${params.id}`,
    method: 'get'
  })
}
export function stats(params) {
  return request({
    url: `/lmp/v2/admin/fleeing/stats` + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
export function download(params) {
  return request({
    url: `/lmp/v2/admin/fleeing/export`,
    method: 'get'
  })
}

export default { get, download, stats }
