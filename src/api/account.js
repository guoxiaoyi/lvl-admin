import request from '@/utils/request'
import qs from 'qs'

export function permissions() {
  return request({
    url: '/lmp/admin/api/store/permissions',
    method: 'get'
  })
}

export function index(params) {
  return request({
    url: '/lmp/admin/api/account',
    method: 'get',
    params
  })
}

export function list(params) {
  return request({
    url: '/lmp/v2/admin/account/list',
    method: 'get',
    params
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
export function edit_store(data) {
  return request({
    url: `/lmp/v2/admin/store`,
    method: 'put',
    data
  })
}

export function edition() {
  return request({
    url: `/lmp/v2/admin/store/edition`,
    method: 'get'
  })
}

export default { permissions, show, edit, del, index, list, edit_store, edition }
