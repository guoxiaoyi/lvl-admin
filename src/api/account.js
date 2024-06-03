import request from '@/utils/request'

export function permissions() {
  return request({
    url: '/lmp/v2/admin/employee/permissions',
    method: 'get'
  })
}

export function index(params) {
  return request({
    url: '/lmp/v2/admin/account',
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
    url: `/lmp/v2/admin/account/${params.id}`,
    method: 'get'
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/account/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/account/${data.id}`,
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

export function bind_qr() {
  return request({
    url: `/lmp/v2/admin/account/bind_qr`,
    method: 'get'
  })
}
export function unbind() {
  return request({
    url: `/lmp/v2/admin/account/unbind`,
    method: 'put'
  })
}

export function trial(data) {
  return request({
    url: `/lmp/v2/admin/allow/trial`,
    method: 'post',
    data
  })
}

export function edit_current_password(data) {
  return request({
    url: `/lmp/v2/admin/account/current/password`,
    method: 'put',
    data
  })
}
export function edit_password(data) {
  return request({
    url: `/lmp/v2/admin/account/${data.id}/password`,
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/account`,
    method: 'post',
    data
  })
}

export default { permissions, show, edit, del, index, list, edit_store, edition, bind_qr, unbind, trial, edit_current_password, edit_password, add }
