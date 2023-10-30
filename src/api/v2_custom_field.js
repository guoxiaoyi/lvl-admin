import request from '@/utils/request'
import qs from 'qs'

export function type() {
  return request({
    url: '/lmp/v2/admin/custom_field/type',
    method: 'get'
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/custom_field/${data.id}`,
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: '/lmp/v2/admin/custom_field',
    method: 'post',
    data
  })
}
export function get(params) {
  return request({
    url: '/lmp/v2/admin/custom_field',
    params
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/custom_field/${data.id}`,
    method: 'delete'
  })
}

export default { get, type, edit, add, del }
