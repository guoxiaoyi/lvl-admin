import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/lmp/v2/admin/push_message',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/push_message/${data.id}`,
    method: 'put',
    data
  })
}
export function show(params) {
  return request({
    url: `/lmp/v2/admin/push_message/${params.id}`
  })
}

export default { add, edit, show }
