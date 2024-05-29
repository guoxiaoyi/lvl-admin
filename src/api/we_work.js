import request from '@/utils/request'

export function customizedAuthUrl(params) {
  return request({
    url: '/lmp/v2/admin/wework/customized_auth_url',
    method: 'get',
    params
  })
}

export function getAuthInfo(params) {
  return request({
    url: '/lmp/v2/admin/wework/auth_info',
    method: 'get',
    params
  })
}

export function getAuthPull(params) {
  return request({
    url: `/lmp/v2/admin/wework/${params.id}/pull_auth_info`,
    method: 'get'
  })
}

export function completed(data) {
  return request({
    url: `/lmp/v2/admin/wework/completed`,
    method: 'put',
    data
  })
}
export function list() {
  return request({
    url: `/lmp/v2/admin/wework_user/list`
  })
}

export default { customizedAuthUrl, getAuthInfo, getAuthPull, completed, list }
