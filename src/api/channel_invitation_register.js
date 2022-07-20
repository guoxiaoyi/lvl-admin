import request from '@/utils/request'
import qs from 'qs'

export function get(params) {
  return request({
    url: `/api/channel_invitation_register/${params.id}`,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: `/api/channel_invitation_register/${data.id}`,
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: `/api/channel_invitation_register`,
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: `/api/channel_invitation_register/${data.id}`,
    method: 'delete',
  })
}

export function qr_code(data) {
  return request({
    url: `/api/channel_invitation_register/qr_code`,
    method: 'post',
    data
  })
}
export default { get, edit, del, add, qr_code }
