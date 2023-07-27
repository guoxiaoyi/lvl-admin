import request from '@/utils/request'

export function add(data) {
  return request({
    url: `/lmp/v2/admin/coupon_verification/reward_rule`,
    method: 'post',
    data
  })
}
export function show(params) {
  return request({
    url: `/lmp/v2/admin/coupon_verification/reward_rule/${params.id}`,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/coupon_verification/reward_rule/${data.id}`,
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/coupon_verification/reward_rule/${data.id}`,
    method: 'delete',
    del
  })
}

export default { add, show, edit, del }
