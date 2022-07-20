import request from '@/utils/request'
import qs from 'qs'

export function update(data) {
  return request({
    url: `/api/channel_register/${data.id}`,
    method: 'get',
    data
  })
}

export function show(params) {
  return request({
    url: `/api/channel_register/${params.id}`,
    method: 'get'
  })
}
export function audit(data) {
  return request({
    url: `/api/channel_register/${data.id}/audit`,
    method: 'put',
    data
  })
}

export default { show, update, audit }
