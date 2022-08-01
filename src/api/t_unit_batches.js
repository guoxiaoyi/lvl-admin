import request from '@/utils/request'
import qs from 'qs'

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

export default { index, del, show, pack_label, add, edit }
