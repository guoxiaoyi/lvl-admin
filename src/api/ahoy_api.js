import request from '@/utils/request'

export function ahoy_create(data) {
  return request({
    url: `/lmp/v2/admin/ahoy/visits`,
    method: 'post',
    data
  })
}

export default { ahoy_create }
