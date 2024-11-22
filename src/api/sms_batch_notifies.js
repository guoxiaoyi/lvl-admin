import request from '@/utils/request'

export function index(params) {
  return request({
    url: `/lmp/v2/admin/send_batch_sms_record`,
    method: 'get'
  })
}

export function show(params) {
  return request({
    url: `/lmp/v2/admin/send_batch_sms_record/${params.id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: `/lmp/v2/admin/send_batch_sms_record`,
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/send_batch_sms_record/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/send_batch_sms_record/${data.id}`,
    method: 'delete'
  })
}

export function user_total(params) {
  return request({
    url: `/lmp/v2/admin/send_batch_sms_record/user_total`,
    params
  })
}

export default { index, show, add, edit, del, user_total }
