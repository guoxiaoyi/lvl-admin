import request from '@/utils/request'

export function index(params) {
  return request({
    url: `/lmp/v2/admin/sms_template`,
    method: 'get'
  })
}
export function all(params) {
  return request({
    url: `/lmp/v2/admin/sms_template/list`,
    method: 'get'
  })
}
export function show(params) {
  return request({
    url: `/lmp/v2/admin/sms_template/${params.id}`,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: `/lmp/v2/admin/sms_template`,
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/sms_template/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/sms_template/${data.id}`,
    method: 'delete'
  })
}

export default { index, all, show, add, edit, del }
