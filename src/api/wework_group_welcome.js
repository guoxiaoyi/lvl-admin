import request from '@/utils/request'

export function add(data) {
  return request({
    url: `/lmp/v2/admin/wework_group_welcome`,
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/wework_group_welcome/${data.id}`,
    method: 'put',
    data
  })
}

export function show(params) {
  return request({
    url: `/lmp/v2/admin/wework_group_welcome/${params.id}`,
    method: 'get',
    params
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/wework_group_welcome/${data.id}`,
    method: 'delete',
    data
  })
}
export function sync(params) {
  return request({
    url: `/lmp/v2/admin/wework_group_welcome/${params.id}/sync`,
    method: 'get'
  })
}

export default { add, show, edit, del, sync }
