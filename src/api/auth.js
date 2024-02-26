import request from '@/utils/request'

export function sign_in_by_token(params) {
  return request({
    url: '/lmp/v2/admin/login/sign_in_by_token',
    method: 'get',
    params
  })
}
export function check_qr_code(params) {
  return request({
    url: '/lmp/v2/admin/login/check_qr_code',
    method: 'get',
    params
  })
}
export function sign_in_qr_code(params) {
  return request({
    url: '/lmp/v2/admin/login/sign_in_qr_code',
    method: 'post',
    params
  })
}

export default { sign_in_qr_code, check_qr_code, sign_in_by_token }
