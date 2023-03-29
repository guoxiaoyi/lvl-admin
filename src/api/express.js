import request from '@/utils/request'
export function list(params) {
  return request({
    url: `/lmp/admin/api/express`,
    method: 'get'
  })
}

export default { list }
