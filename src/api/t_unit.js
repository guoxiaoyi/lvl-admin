import request from '@/utils/request'
import qs from 'qs'

export function index() {
  return request({
    url: '/lmp/admin/api/t_channel_receipt',
    method: 'get'
  })
}

export function del(data, id){
  return request({
    url: `/lmp/admin/api/t_channel_receipt/${id}/t_units/delete`,
    method: 'delete',
    data
  })
}

export default { del }
