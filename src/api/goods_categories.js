import request from '@/utils/request'
export function add(data) {
  return request({
    url: '/lmp/v2/admin/good_category',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/good_category/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/good_category/${data.id}`,
    method: 'delete',
    data
  })
}
export function list() {
  return request({
    url: '/lmp/v2/admin/good_category/list'
  })
}

export default { add, del, edit, list }
