import request from '@/utils/request'
export function show(params) {
  return request({
    url: `/lmp/v2/admin/gift_order/${params.id}`,
    method: 'get'
  })
}

export default { show }
