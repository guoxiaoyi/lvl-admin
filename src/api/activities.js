import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lmp/v2/admin/activity',
    method: 'get',
    params
  })
}

export default { list }
