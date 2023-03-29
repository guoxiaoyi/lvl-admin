import request from '@/utils/request'
import qs from 'qs'
export function show(params) {
  console.log(params)
  return request({
    url: `/lmp/admin/api/couponVerificationAudit/${params.id}/detail`,
    method: 'get',
    params
  })
}
export function stock(params) {
  return request({
    url: `/lmp/admin/api/couponVerificationStock/stock/channel/${params.channelId}`,
    method: 'get',
    params
  })
}
export function apply(data) {
  return request({
    url: `/lmp/admin/api/couponVerificationAudit/apply`,
    method: 'post',
    data
  })
}
export function download(params) {
  return request({
    url: `/lmp/admin/api/couponVerifications/download?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
export default { show, stock, apply, download }

