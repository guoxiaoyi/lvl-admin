import request from '@/utils/request'

export function del(data) {
  return request({
    url: `/lmp/v2/admin/wx_reply/${data.id}`,
    method: 'delete',
    data
  })
}
export function show(params) {
  return request({
    url: `/lmp/v2/admin/wx_reply/${params.id}`,
    method: 'get'
  })
}

export function types(params) {
  return request({
    url: `/lmp/v2/admin/wx_reply/types`,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/wx_reply/${data.id}`,
    method: 'put',
    data
  })
}

export function reset_picture(data) {
  return request({
    url: `/lmp/v2/admin/wx_reply/${data.id}/reset_picture`,
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/wx_reply`,
    method: 'post',
    data
  })
}

export default { del, show, types, edit, reset_picture, add }
