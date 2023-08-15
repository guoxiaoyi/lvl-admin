import request from '@/utils/request'
import qs from 'qs'
export function list(params) {
  return request({
    url: '/lmp/v2/admin/activity',
    method: 'get',
    params
  })
}

export function all(params) {
  return request({
    url: '/lmp/v2/admin/activity/list',
    method: 'get',
    params
  })
}

export function restore(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/restore`,
    method: 'put',
    data
  })
}

export function real_delete(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/real_delete`,
    method: 'delete',
    data
  })
}

export function type(params) {
  return request({
    url: `/lmp/v2/admin/activity/page_types`,
    method: 'get',
    params
  })
}

export function show(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.id}`,
    method: 'get'
  })
}

export function user_export(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.id}/user/export?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { list, restore, real_delete, type, show, all, user_export }
