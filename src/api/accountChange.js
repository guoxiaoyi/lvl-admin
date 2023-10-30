import request from '@/utils/request'

export function currentCertification() {
  return request({
    url: '/lmp/v2/admin/account_change/current_certification',
    method: 'get'
  })
}
export function show(params) {
  return request({
    url: `/lmp/v2/admin/account_change/${params.id}`,
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

export function add(data) {
  return request({
    url: `/lmp/v2/admin/account_change`,
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
    url: `/lmp/v2/admin/account_change/current`,
    method: 'get',
    params
  })
}

export function accountChangeEdit(data) {
  return request({
    url: `/lmp/v2/admin/account_change/${data.id}`,
    method: 'put',
    data
  })
}

export function addAccountChangeAdmin(data) {
  return request({
    url: `/lmp/v2/admin/account_change/admin`,
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
    url: `/lmp/v2/admin/account_change/${data.id}/cancel`,
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
