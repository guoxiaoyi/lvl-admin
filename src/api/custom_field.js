import request from '@/utils/request'
import qs from 'qs'

export function type() {
  return request({
    url: '/lmp/admin/api/custom_field/type',
    method: 'get'
  })
}
export function edit(data) {
  return request({
    url: `/lmp/admin/api/custom_field/${data.id}`,
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: '/lmp/admin/api/custom_field',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/admin/api/custom_field/${data.id}`,
    method: 'delete'
  })
}

export default { type, edit, add, del }
