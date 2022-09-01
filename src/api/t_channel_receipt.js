import request from '@/utils/request'
import qs from 'qs'

export function index() {
  return request({
    url: '/lmp/admin/api/t_channel_receipt',
    method: 'get'
  })
}

export function in_out_type(params) {
  return request({
    url: '/lmp/admin/api/t_channel_receipt/in_out_type',
    method: 'get',
    params
  })
}

export function addTunits(data, id) {
  return request({
    url: `/lmp/admin/api/t_channel_receipt/${id}/t_units/add`,
    method: 'post',
    data
  })
}
export function show(id) {
  return request({
    url: `/lmp/admin/api/t_channel_receipt/${id}`,
    method: 'get'
  })
}

export function t_units(id) {
  return request({
    url: `/lmp/admin/api/t_channel_receipt/${id}/t_units`,
    method: 'get'
  })
}

export function execute(id) {
  return request({
    url: `/lmp/admin/api/t_channel_receipt/${id}/execute`,
    method: 'post'
  })
}

export function t_unit_batches(id) {
  return request({
    url: `/lmp/admin/api/t_channel_receipt/${id}/t_unit_batches`,
    method: 'get'
  })
}
export function del(data) {
  return request({
    url: `/lmp/admin/api/t_channel_receipt/${data.id}`,
    method: 'delete'
  })
}
export function cancel(id) {
  return request({
    url: `/lmp/admin/api/t_channel_receipt/${id}/cancel`,
    method: 'put'
  })
}
export function download(params) {
  return request({
    url: `/lmp/admin/api/t_channel_receipt/download`,
    method: 'get',
    params
  })
}

export default { index, in_out_type, addTunits, show, execute, t_unit_batches, del, cancel, download
 }
