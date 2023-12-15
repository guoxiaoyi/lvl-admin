import request from '@/utils/request'
export function show(params) {
  return request({
    url: `/lmp/v2/admin/notice/${params.id}`,
    method: 'get'
  })
}

export default { show }
