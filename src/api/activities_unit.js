import request from '@/utils/request'
import qs from 'qs'
export function batch_destroy(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/batch_destroy?` + qs.stringify(data, { indices: false }),
    method: 'delete'
  })
}
export function batch_enabled(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/batch_enabled?` + qs.stringify(data, { indices: false }),
    method: 'put'
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.origin.activityId}/units/${data.id}`,
    method: 'delete',
    data
  })
}
export function enabled(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/units/${data.id}/enabled`,
    method: 'put',
    data
  })
}

export default { batch_destroy, batch_enabled, del, enabled }
