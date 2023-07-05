import request from '@/utils/request'

export function tmp(data) {
  return request({
    url: '/lmp/admin/api/amazon/upload/tmp',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}

export function download(params) {
  return request({
    url: '/lmp/v2/admin/amazon/private/file',
    method: 'get',
    params
  })
}

export default { tmp, download }
