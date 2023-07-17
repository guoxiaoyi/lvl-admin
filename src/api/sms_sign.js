import request from '@/utils/request'

export function index(params) {
  return request({
    url: `/lmp/v2/admin/sms_sign`,
    method: 'get'
  })
}
export function all(params) {
  return request({
    url: `/lmp/v2/admin/sms_sign/list`,
    method: 'get'
  })
}
export function show(params) {
  return request({
    url: `/lmp/v2/admin/sms_sign/${params.id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: `/lmp/v2/admin/sms_sign`,
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/sms_sign/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/sms_sign/${data.id}`,
    method: 'delete'
  })
}

export default { index, all, show, add, edit, del }
