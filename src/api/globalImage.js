import request from '@/utils/request'

export function getGlobalImage(params) {
  return request({
    url: '/lmp/admin/api/image',
    method: 'get',
    params
  })
}

export function postGlobalImage(data) {
  return request({
    url: '/lmp/admin/api/image',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}
