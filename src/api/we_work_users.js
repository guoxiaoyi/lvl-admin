import request from '@/utils/request'

export function edit(data) {
  return request({
    url: `/lmp/admin/wework/${data.id}`,
    method: 'PUT',
    data
  })
}
export function active(data) {
  return request({
    url: `/lmp/admin/api/weworksActiveCodes/active`,
    method: 'post',
    data
  })
}
export function list(params) {
  return request({
    url: `/lmp/admin/wework/getEmployee`,
    method: 'get',
    params
  })
}

export default { edit, active, list }
