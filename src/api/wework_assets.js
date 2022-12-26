import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/lmp/admin/api/wework_media/upload_image',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}

export function addMedia(data) {
  return request({
    url: '/lmp/admin/api/wework_media/upload_media',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}

export default { add, addMedia }
