import request from '@/utils/request'
export function all(params) {
  return request({
    url: '/lmp/v2/admin/tag/list',
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
    headers: {
      'Content-Type': 'application/json'
    },
    data: data.name
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/tag/${data.id}`,
    method: 'delete',
    data
  })
}

export function sync(data) {
  return request({
    url: `/lmp/v2/admin/tag/setting_sync`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
export function get_setting_info(data) {
  return request({
    url: `/lmp/v2/admin/tag/setting_info`
  })
}

export default { all, list, add, edit, del, sync, get_setting_info }
