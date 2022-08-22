import request from '@/utils/request'

export function index(params) {
  return request({
    url: '/lmp/admin/api/t_unit_batch',
    method: 'get',
    params
  })
}
export function del(data) {
  return request({
    url: `/lmp/admin/api/t_unit_batch/${data.id}`,
    method: 'delete',
    data
  })
}
export function show(params) {
  return request({
    url: `/lmp/admin/api/t_unit_batch/${params.id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: `/lmp/admin/api/t_unit_batch`,
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/admin/api/t_unit_batch/${data.id}`,
    method: 'put',
    data
  })
}
export function pack_label(params) {
  return request({
    url: `/lmp/admin/api/t_unit_batch/${params.id}/pack_label`,
    method: 'get'
  })
}
export function t_unit_pack_imports(id, data) {
  return request({
    url: `/lmp/admin/api/t_unit_batch/${id}/t_unit_pack_imports`,
    method: 'post',
    data
  })
}
export function t_unit_suite_imports(id, data) {
  return request({
    url: `/lmp/admin/api/t_unit_batch/${id}/t_unit_suite_imports`,
    method: 'post',
    data
  })
}
export function can_suite_imports() {
  return request({
    url: `/lmp/admin/api/t_unit_batch/t_unit_suite_imports`,
    method: 'get'
  })
}

export function can_pack_imports() {
  return request({
    url: `/lmp/admin/api/t_unit_batch/t_unit_pack_imports`,
    method: 'get'
  })
}

export default { index, del, show, pack_label, add, edit, t_unit_pack_imports, t_unit_suite_imports, can_pack_imports, can_suite_imports }
