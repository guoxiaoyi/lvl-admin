import request from '@/utils/request'
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/page`,
    method: 'put',
    data
  })
}

export function get_page_image(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/page_image`,
    method: 'get'
  })
}

export function get(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.id}/page`,
    method: 'get'
  })
}

export function reset_banner(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/reset_banner`,
    method: 'put',
    data
  })
}

export function reset_bg_img(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/reset_bg_img`,
    method: 'put',
    data
  })
}

export function reset_music(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/reset_music`,
    method: 'put',
    data
  })
}

export function update_page_images(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/page_image/${data.id}`,
    method: 'put',
    data
  })
}

export function add_page_images(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/page_image`,
    method: 'post',
    data
  })
}
export function del_page_images(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/page_image/${data.id}`,
    method: 'delete',
    data
  })
}

export default { edit, get, get_page_image, reset_banner, reset_bg_img, reset_music, update_page_images, add_page_images, del_page_images }
