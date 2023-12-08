import request from '@/utils/request'
export function del(data) {
  console.log(data.origin)
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

export default { del, show }
