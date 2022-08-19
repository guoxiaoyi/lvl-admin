import request from '@/utils/request'

export function index(params) {
  return request({
    url: '/lmp/admin/api/t_channel_receipt',
    method: 'get',
    params
  })
}

export function show(id) {
  return request({
    url: `/lmp/admin/api/t_unit/${id}`,
    method: 'get'
  })
}

export function del(data, id) {
  return request({
    url: `/lmp/admin/api/t_channel_receipt/${id}/t_units/delete`,
    method: 'delete',
    data
  })
}

export function relation(id) {
  return request({
    url: `/lmp/admin/api/t_unit/${id}/relation`,
    method: 'get'
  })
}

export function receipts(id) {
  return request({
    url: `/lmp/admin/api/t_unit/${id}/receipts`,
    method: 'get'
  })
}

export function destroy(id) {
  return request({
    url: `/lmp/admin/api/t_unit_batch/${id}/t_units/delete`,
    method: 'delete'
  })
}

export default { del, show, relation, receipts, destroy }
