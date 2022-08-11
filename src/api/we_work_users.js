import request from '@/utils/request'

export function edit(data) {
  return request({
    url: `/lmp/admin/wework/${data.id}`,
    method: 'PUT',
    data
  })
}

export default { edit }
