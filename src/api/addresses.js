import request from '@/utils/request'

export function index(params) {
  return request({
    url: '/lmp/v2/admin/address',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/lmp/v2/admin/address',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/address/${data.id}`,
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/address/${data.id}`,
    method: 'delete',
    data
  })
}

export default { add, edit, del, index }
