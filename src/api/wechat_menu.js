import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lmp/v2/admin/wechat_menus/list',
    method: 'get',
    params
  })
}

export function menuTypes() {
  return request({
    url: '/lmp/v2/admin/wechat_menus/select_items',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/lmp/v2/admin/wechat_menus',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/wechat_menus/${data.id}`,
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/wechat_menus/${data.id}`,
    method: 'delete',
    data
  })
}

export function sort(data) {
  return request({
    url: `/lmp/v2/admin/wechat_menus/${data.id}/update_position/${data.targetPos}`,
    method: 'put',
    data
  })
}
export function pull(data) {
  return request({
    url: `/lmp/v2/admin/wechat_menus/pull`,
    method: 'post',
    data
  })
}
export function push(data) {
  return request({
    url: `/lmp/v2/admin/wechat_menus/push`,
    method: 'post',
    data
  })
}

export default { list, menuTypes, add, edit, del, sort, pull, push }
