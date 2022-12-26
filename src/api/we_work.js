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

export function completed(data) {
  return request({
    url: `/lmp/admin/wework/completed`,
    method: 'put',
    data
  })
}

export default { customizedAuthUrl, getAuthInfo, getAuthPull, completed }
