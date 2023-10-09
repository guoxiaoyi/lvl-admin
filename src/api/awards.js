import request from '@/utils/request'
export function add(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/awards`,
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/awards/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/awards/${data.id}`,
    method: 'delete',
    data
  })
}
export function get(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.activityId}/awards/${params.id}`
  })
}

export function total_winning_probability(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.activityId}/awards/total_winning_probability`
  })
}

export function index(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.activityId}/awards`
  })
}

export default { index, add, edit, del, get, total_winning_probability }
