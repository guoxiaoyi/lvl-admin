import request from '@/utils/request'
import qs from 'qs'

export function all(params) {
  return request({
    url: '/lmp/admin/api/product/all',
    method: 'get',
    params
  })
}

export function index() {
  return request({
    url: '/lmp/admin/api/product',
    method: 'get'
  })
}

export function show(id) {
  return request({
    url: `/lmp/admin/api/product/${id}`,
    method: 'get'
  })
}

export function t_unit_specs(params) {
  return request({
    url: `/lmp/admin/api/t_unit_spec/all`,
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: `/lmp/admin/api/product`,
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/admin/api/product/${data.id}`,
    method: 'put',
    data
  })
}

export default { all, index, show, t_unit_specs, add, edit }
