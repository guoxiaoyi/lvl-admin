import request from '@/utils/request'

export function show(params) {
  return request({
    url: `/lmp/admin/api/role/${params.id}`,
    method: 'get'
  })
}

export default { show }
