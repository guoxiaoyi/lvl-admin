import request from '@/utils/request'
import qs from 'qs'
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
export function v2_list(params) {
  const _params = { ...params, enable: 1 }
  return request({
    url: `/lmp/v2/admin/wework_user?` + qs.stringify(_params, { indices: false }),
    method: 'get'
  })
}

export default { edit, active, list, v2_list }
