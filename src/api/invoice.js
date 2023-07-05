import request from '@/utils/request'

export function show(params) {
  return request({
    url: `/lmp/v2/admin/invoice`,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/invoice`,
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/invoice`,
    method: 'post',
    data
  })
}

export default { show, edit, add }
