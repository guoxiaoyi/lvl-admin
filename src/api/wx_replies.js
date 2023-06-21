import request from '@/utils/request'

export function del(data) {
  return request({
    url: `/lmp/v2/admin/wx_reply/${data.id}`,
    method: 'delete',
    data
  })
}
export function show(params) {
  return request({
    url: `/lmp/v2/admin/wx_reply/${params.id}`,
    method: 'get'
  })
}

export default { del, show }
