import request from '@/utils/request'
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/advance_edit`,
    method: 'post',
    data
  })
}
export function get(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.id}/advance_info`,
    method: 'get'
  })
}

export default { edit, get }
