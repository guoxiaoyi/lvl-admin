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

export function get_url(data) {
  return request({
    url: '/lmp/v2/admin/unit/get_url',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/unit/${data.id}`,
    method: 'delete',
    data
  })
}
export function get(params) {
  return request({
    url: `/lmp/v2/admin/unit/${params.id}`
  })
}

export default { batch_destroy, batch_enabled, get_url, del, get }
