import request from '@/utils/request'

export function info(params) {
  return request({
    url: '/lmp/v2/admin/wechat_mini_program/vip',
    method: 'get',
    params
  })
}

export function authorize_url(url) {
  return request({
    url: `/lmp/v2/admin/wechat_mini_program/authorize_url?redirectUri=${url}`,
    method: 'get'
  })
}

export function query_auth(params) {
  return request({
    url: `/lmp/v2/admin/wechat_mini_program/query_auth`,
    method: 'get',
    params
  })
}
export function get(params) {
  return request({
    url: `/lmp/v2/admin/wechat_mini_program/vip`,
    method: 'get',
    params
  })
}

export default { info, authorize_url, query_auth, get }
