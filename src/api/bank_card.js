import request from '@/utils/request'

export function show(params) {
  return request({
    url: `/lmp/v2/admin/bank_card`,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/bank_card`,
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/bank_card`,
    method: 'post',
    data
  })
}

export default { show, edit, add }
