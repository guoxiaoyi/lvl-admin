import request from '@/utils/request'

export function index(params) {
  return request({
    url: `/lmp/v2/admin/account_role`,
    method: 'get'
  })
}
export function show(params) {
  return request({
    url: `/lmp/v2/admin/account_role/${params.id}`,
    method: 'get'
  })
}
export function permission() {
  return request({
    url: `/lmp/v2/admin/account_role/permissions`,
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/account_role`,
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/account_role/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/account_role/${data.id}`,
    method: 'delete'
  })
}

export default { index, show, permission, add, edit, del }
