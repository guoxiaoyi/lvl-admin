import request from '@/utils/request'
import qs from 'qs'

export function add(data) {
  return request({
    url: '/api/t_channel_receipt/out',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/api/t_channel_receipt/${data.id}`,
    method: 'put',
    data
  })
}


export default { add, edit }
