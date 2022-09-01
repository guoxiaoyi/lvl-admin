import request from '@/utils/request'

export function index(params) {
  return request({
    url: `/lmp/admin/api/role`,
    method: 'get'
  })
}
export function show(params) {
  return request({
    url: `/lmp/admin/api/role/${params.id}`,
    method: 'get'
  })
}
export function permission() {
  return request({
    url: `/lmp/admin/auth/store/permission`,
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: `/lmp/admin/api/role`,
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/admin/api/role/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/admin/api/role/${data.id}`,
    method: 'delete'
  })
}

export default { index, show, permission, add, edit, del }
