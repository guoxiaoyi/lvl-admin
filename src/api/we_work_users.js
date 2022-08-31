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

export default { edit, active }
