import request from '@/utils/request'
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/page_order_result`,
    method: 'put',
    data
  })
}

export function show(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.activityId}/page_order_result`
  })
}
export default { edit, show }
