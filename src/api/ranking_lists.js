import request from '@/utils/request'

export function show(params) {
  return request({
    url: `/lmp/v2/admin/ranking_list/${params.id}`,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/ranking_list/${data.id}`,
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/ranking_list`,
    method: 'post',
    data
  })
}

export function reset_banners(data) {
  return request({
    url: `/lmp/v2/admin/ranking_list/${data.id}/reset_banner`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/ranking_list/${data.id}`,
    method: 'delete'
  })
}

export default { show, edit, add, reset_banners, del }
