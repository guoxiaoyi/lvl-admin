import request from '@/utils/request'
export function show(params) {
  return request({
    url: `/lmp/v2/admin/store_setting`,
    method: 'get'
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/store_setting`,
    method: 'put',
    data
  })
}
export function clear_stock(data) {
  return request({
    url: `/lmp/v2/admin/gift_goods/clear_stock`,
    method: 'put',
    data
  })
}
export function guide_after_certificate(data) {
  return request({
    url: `/lmp/v2/admin/store/guide_after_certificate`,
    method: 'put',
    data
  })
}
export function edition_functions() {
  return request({
    url: `/lmp/v2/admin/store/edition_functions`
  })
}
export function toggle_common_vip_mini_program() {
  return request({
    url: `/lmp/v2/admin/store/toggle_common_vip_mini_program`,
    method: 'put'
  })
}

export default { show, edit, clear_stock, guide_after_certificate, edition_functions, toggle_common_vip_mini_program }
