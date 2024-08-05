import request from '@/utils/request'
export function register(params) {
  return request({
    url: '/lmp/v2/admin/vip_setting/register',
    method: 'get',
    params
  })
}

export function vip_interest_list(params) {
  return request({
    url: '/lmp/v2/admin/vip_setting/vip_interest/list',
    method: 'get',
    params
  })
}

export function task(params) {
  return request({
    url: `/lmp/v2/admin/vip_setting/tasks`,
    method: 'get',
    params
  })
}

export function update_task(data) {
  return request({
    url: `/lmp/v2/admin/vip_setting/update_task`,
    method: 'put',
    data
  })
}

export function reset_banners(data) {
  return request({
    url: `/lmp/v2/admin/vip_setting/register/reset_banners`,
    method: 'put',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/vip_setting/register`,
    method: 'put',
    data
  })
}
export function toggle_register_enabled(data) {
  return request({
    url: `/lmp/v2/admin/vip_setting/toggle_register_enabled`,
    method: 'post',
    data
  })
}

export default { register, vip_interest_list, task, update_task, reset_banners, edit, toggle_register_enabled }
