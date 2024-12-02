import request from '@/utils/request'

export function getSetting(params) {
  return request({
    url: '/lmp/v2/admin/invite_vip_register_setting',
    params
  })
}
export function edit(data) {
  return request({
    url: '/lmp/v2/admin/invite_vip_register_setting',
    method: 'put',
    data
  })
}

export function poster(data) {
  return request({
    url: '/lmp/v2/admin/invite_vip_register_setting/poster',
    method: 'put',
    data
  })
}
export function resetPoster(data) {
  return request({
    url: '/lmp/v2/admin/invite_vip_register_setting/poster/reset',
    method: 'put',
    data
  })
}

export default { getSetting, edit, poster, resetPoster }
