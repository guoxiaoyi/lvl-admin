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
    url: '/api/t_channel_receipt/in_out_type',
    method: 'get',
    params
  })
}

export function addTunits(data, id){
  return request({
    url: `/api/t_channel_receipt/${id}/t_units/add`,
    method: 'post',
    data
  })
}
export function show(id){
  return request({
    url: `/api/t_channel_receipt/${id}`,
    method: 'get'
  })
}

export function t_units(id){
  return request({
    url: `/api/t_channel_receipt/${id}/t_units`,
    method: 'get'
  })
}

export function execute(id){
  return request({
    url: `/api/t_channel_receipt/${id}/execute`,
    method: 'post'
  })
}

export default { index, in_out_type, addTunits, show, execute }
