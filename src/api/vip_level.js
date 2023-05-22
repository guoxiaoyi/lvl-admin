import request from '@/utils/request'
export function list(params) {
  return request({
    url: '/lmp/v2/admin/vip_level/list',
    method: 'get',
    params
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/vip_level/${data.id}`,
    method: 'delete',
    data
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/vip_level`,
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/vip_level/${data.id}`,
    method: 'put',
    data
  })
}

export default { list, del, add, edit }
