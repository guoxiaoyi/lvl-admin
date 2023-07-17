import request from '@/utils/request'
export function show(params) {
  return request({
    url: `/lmp/v2/admin/gift/suite_card/${params.id}`,
    method: 'get'
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/gift/suite_card/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/gift/suite_card/${data.id}`,
    method: 'delete',
    data
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/gift/suite_card`,
    method: 'post',
    data
  })
}
export function reset_cover_img(data) {
  return request({
    url: `/lmp/v2/admin/gift/suite_card/${data.id}/reset_cover_img`,
    method: 'put',
    data
  })
}

export default { show, edit, add, reset_cover_img, del }
