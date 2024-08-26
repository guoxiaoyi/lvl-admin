import request from '@/utils/request'

export function merchant(params) {
  return request({
    url: '/lmp/v2/admin/wechat_mini_program/merchant',
    method: 'get',
    params
  })
}
export function qr_code(data) {
  return request({
    url: '/lmp/v2/admin/wechat_mini_program/qr_code',
    method: 'post',
    data
  })
}

export function qr_code_by_appid(data) {
  return request({
    url: '/lmp/v2/admin/wechat_mini_program/qr_code_by_appid',
    method: 'post',
    data
  })
}
export function vip_qr_code(data) {
  return request({
    url: '/lmp/v2/admin/wechat_mini_program/vip_qr_code',
    method: 'post',
    data
  })
}

export default { merchant, qr_code, qr_code_by_appid, vip_qr_code }
