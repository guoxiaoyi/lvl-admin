import request from '@/utils/request'
export function all(params) {
  return request({
    url: '/lmp/admin/api/tag/all',
    method: 'get',
    params
  })
}

export function list(params) {
  return request({
    url: '/lmp/v2/admin/tag',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/lmp/v2/admin/tag',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/tag/${data.id}`,
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/tag/${data.id}`,
    method: 'delete',
    data
  })
}

export function tag_sync(data) {
  return request({
    url: `/lmp/v2/admin/tag/setting_sync`,
    method: 'put',
    data
  })
}

export default { all, list, add, edit, del, tag_sync }
