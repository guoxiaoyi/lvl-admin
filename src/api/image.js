import request from '@/utils/request'

export function getImages(params) {
  return request({
    url: '/lmp/admin/api/image',
    method: 'get',
    params
  })
}
export function deleteImages(data) {
  return request({
    url: '/lmp/admin/api/image',
    method: 'delete',
    data
  })
}
export function restoreImages(data) {
  return request({
    url: '/lmp/admin/api/image/restore',
    method: 'post',
    data
  })
}
export function postImage(data) {
  return request({
    url: '/lmp/admin/api/image',
    method: 'post',
    data
  })
}
export default { getImages, deleteImages, restoreImages, postImage }
