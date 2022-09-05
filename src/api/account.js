import request from '@/utils/request'
import qs from 'qs'

export function permissions() {
  return request({
    url: '/lmp/admin/api/store/permissions',
    method: 'get'
  })
}
export function show(params) {
  return request({
    url: `/lmp/admin/api/account/${params.id}`,
    method: 'get'
  })
}
export function edit(data) {
  return request({
    url: `/lmp/admin/api/account/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/admin/api/account/${data.id}`,
    method: 'delete',
    data
  })
}

export default { permissions, show, edit, del }
