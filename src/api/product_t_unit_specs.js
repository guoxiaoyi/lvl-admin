import request from '@/utils/request'

export function add(data) {
  return request({
    url: `/lmp/v2/admin/product/${data.id}/t_unit_specs`,
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/t_unit_spec/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/t_unit_spec/${data.id}`,
    method: 'delete'
  })
}

export function type() {
  return request({
    url: `/lmp/v2/admin/t_unit_spec/type`,
    method: 'get'
  })
}

export function label(params) {
  return request({
    url: `/lmp/v2/admin/t_unit_spec/${params.id}/label`,
    method: 'get'
  })
}

export default { add, edit, del, type, label }
