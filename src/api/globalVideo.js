import request from '@/utils/request'
export function postGlobalVideo(data) {
  return request({
    url: '/lmp/v2/admin/video',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/video/${data.id}`,
    method: 'delete',
    data
  })
}

export default { del }
