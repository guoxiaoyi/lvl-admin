import request from '@/utils/request'
import qs from 'qs'
export function del(data) {
  return request({
    url: `/lmp/v2/admin/goods/${data.origin.goodId}/coupons/${data.id}`,
    method: 'delete'
  })
}

export function show(params) {
  return request({
    url: `/lmp/v2/admin/coupon_verification/detail_all/${params.id}`,
    method: 'get'
  })
}
export function download(params) {
  return request({
    url: `/lmp/v2/admin/coupon_verification/detail_all/export?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { del, show, download }
