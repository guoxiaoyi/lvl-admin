import request from '@/utils/request'

export function currentCertification() {
  return request({
    url: '/lmp/admin/api/accountChange/currentCertification',
    method: 'get'
  })
}
export function show(params) {
  return request({
    url: `/lmp/admin/api/accountChange/${params.id}`,
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

export function add(data) {
  return request({
    url: `/lmp/admin/api/accountChange`,
    method: 'post',
    data
  })
}

export function qr_code_create(data) {
  return request({
    url: `/admin/account_changes/qr_code_create`,
    method: 'post',
    data
  })
}

export function current(params) {
  return request({
    url: `/lmp/admin/api/accountChange/currentAdmin`,
    method: 'get',
    params
  })
}

export function accountChangeEdit(data) {
  return request({
    url: `/lmp/admin/api/accountChange/${data.id}`,
    method: 'put',
    data
  })
}

export function addAccountChangeAdmin(data) {
  return request({
    url: `/lmp/admin/api/accountChange/admin`,
    method: 'post',
    data
  })
}

export function checkPerName(url) {
  return request({
    url: url,
    method: 'post'
  })
}

export function cancel(data) {
  return request({
    url: `/lmp/admin/api/accountChange/${data.id}/cancel`,
    method: 'put',
    data
  })
}
export function get_company(params) {
  return request({
    url: `/lmp/v2/admin/company`,
    method: 'get',
    params
  })
}
export function edit_company(data) {
  return request({
    url: `/lmp/v2/admin/company`,
    method: 'put',
    data
  })
}

export default { currentCertification, show, edit, del, add, qr_code_create, current, accountChangeEdit, addAccountChangeAdmin, checkPerName, cancel, get_company, edit_company }
