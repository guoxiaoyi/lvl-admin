import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lmp/v2/admin/activity',
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

export default { list, restore, real_delete }
