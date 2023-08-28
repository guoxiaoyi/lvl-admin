import request from '@/utils/request'

export function getGlobalImage(params) {
  return request({
    url: '/lmp/v2/admin/image',
    method: 'get',
    params
  })
}

export function postGlobalImage(data) {
  return request({
    url: '/lmp/v2/admin/image',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/image/${data.id}`,
    method: 'delete',
    data
  })
}

export default { del }
