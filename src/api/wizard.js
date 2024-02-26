import request from '@/utils/request'

export function edit(data) {
  return request({
    url: '/lmp/v2/admin/store/admin_wizard',
    method: 'put',
    data
  })
}

export default { edit }
