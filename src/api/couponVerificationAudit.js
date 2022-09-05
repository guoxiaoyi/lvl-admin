import request from '@/utils/request'
export function show(params) {
  console.log(params)
  return request({
    url: `/lmp/admin/api/couponVerificationAudit/${params.id}/detail`,
    method: 'get',
    params
  })
}
export default { show }

