import request from '@/utils/request'
export function show(params) {
  return request({
    url: `/lmp/v2/admin/notification/${params.id}`,
    method: 'get'
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/notification/${data.id}`,
    method: 'delete',
    data
  })
}

export function count_read_false(params) {
  return request({
    url: `/lmp/v2/admin/notification/count_read_false`,
    method: 'get',
    params
  })
}

export function mark_all_as_read(data) {
  return request({
    url: `/lmp/v2/admin/notification/mark_all_as_read`,
    method: 'put',
    data
  })
}
export function empty(data) {
  return request({
    url: `/lmp/v2/admin/notification/empty`,
    method: 'delete',
    data
  })
}

export default { show, del, count_read_false, mark_all_as_read, empty }
