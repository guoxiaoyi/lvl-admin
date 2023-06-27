import request from '@/utils/request'

export function show() {
  return request({
    url: '/lmp/v2/admin/wechat_profile',
    method: 'get'
  })
}

export function pre_auth_url(url) {
  return request({
    url: `/lmp/v2/admin/wechat_profile/pre_auth_url?redirectUri=${url}`,
    method: 'get'
  })
}

export function authorize(authCode) {
  return request({
    url: `/lmp/v2/admin/wechat_profile/authorize/${authCode}`,
    method: 'post'
  })
}

export default { show, pre_auth_url, authorize }
