import request from '@/utils/request'

export function show(params) {
  return request({
    url: `/lmp/v2/admin/coupon_verification/${params.id}`,
    method: 'get'
  })
}
export function coupons(params) {
  return request({
    url: `/lmp/v2/admin/coupon_verification/${params.id}/coupons`,
    method: 'get'
  })
}

export default { show, coupons }
