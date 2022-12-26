import request from '@/utils/request'

export function show(params) {
  console.log(params)
  return request({
    url: `/lmp/admin/api/wework_group_message/${params.id}`,
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: `/lmp/admin/api/wework_group_message`,
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/admin/api/wework_group_message/${data.id}`,
    method: 'put',
    data
  })
}
export function statistics(params) {
  return request({
    url: `/lmp/admin/api/wework_group_message/${params.id}/statistics`,
    method: 'get',
    params
  })
}

export default { show, add, edit, statistics }
