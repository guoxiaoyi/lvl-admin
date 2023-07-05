import request from '@/utils/request'
export function show() {
  return request({
    url: '/lmp/v2/admin/oauth_application',
    method: 'get'
  })
}
export function edit(data) {
  return request({
    url: '/lmp/v2/admin/oauth_application',
    method: 'put',
    data
  })
}
export function secret(params) {
  return request({
    url: '/lmp/v2/admin/oauth_application/secret',
    method: 'get',
    params
  })
}

export default { edit, show, secret }
