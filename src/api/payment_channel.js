import request from '@/utils/request'

export function show(params) {
  return request({
    url: '/lmp/v2/admin/payment_channel/wechat',
    method: 'get',
    params
  })
}

export function edit(data) {
  return request({
    url: '/lmp/v2/admin/payment_channel/wechat',
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: '/lmp/v2/admin/payment_channel/wechat',
    method: 'post',
    data
  })
}

export default { show, edit, add }
