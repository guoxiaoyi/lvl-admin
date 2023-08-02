import request from '@/utils/request'
import qs from 'qs'
export function show(params) {
  return request({
    url: `/lmp/v2/admin/coupon_verification_audit/${params.id}`,
    method: 'get'
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
    url: `/lmp/v2/admin/coupon_verification_audit`,
    method: 'post',
    data
  })
}
export function download(params) {
  return request({
    url: `/lmp/v2/admin/coupon_verification/export?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function delivering_failed(data) {
  return request({
    url: `/lmp/v2/admin/coupon_verification/reward_order/delivering_failed`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data)
  })
}

export function download_for_goods(goodsId, params) {
  return request({
    url: `/lmp/v2/admin/goods/${goodsId}/verified_coupons/export?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { show, stock, apply, download, delivering_failed, download_for_goods }

