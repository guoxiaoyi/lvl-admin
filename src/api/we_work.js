import request from '@/utils/request'

export function customizedAuthUrl(params) {
  return request({
    url: '/lmp/admin/wework/customizedAuthUrl',
    method: 'get',
    params
  })
}
export function getAuthInfo(params) {
  return request({
    url: '/lmp/admin/wework/getAuthInfo',
    method: 'get',
    params
  })
}
export function getAuthPull(params) {
  return request({
    url: `/lmp/admin/wework/${params.id}/pullAuthInfo`,
    method: 'get'
  })
}

export default { customizedAuthUrl, getAuthInfo, getAuthPull }
