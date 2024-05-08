import request from '@/utils/request'

export function add(data) {
  return request({
    url: `/lmp/v2/admin/wework_welcome`,
    method: 'post',
    data
  })
}

export function show(params) {
  return request({
    url: `/lmp/v2/admin/wework_welcome/${params.id}`,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/wework_welcome/${data.id}`,
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/wework_welcome/${data.id}`,
    method: 'delete',
    data
  })
}

export default { add, show, del, edit }
