import request from '@/utils/request'

export function show(params) {
  return request({
    url: `/lmp/v2/admin/cash_deal/${params.id}`,
    method: 'get'
  })
}

export default { show }
