import request from '@/utils/request'
export function home(params) {
  return request({
    url: `/lmp/v2/admin/store_nav/mini/home`,
    method: 'get'
  })
}
export function save_mini_home(data) {
  return request({
    url: `/lmp/v2/admin/store_nav/mini/home`,
    method: 'put',
    data
  })
}

export function navs_setting(params) {
  return request({
    url: `/lmp/v2/admin/store_nav/mini`,
    method: 'get',
    params
  })
}

export function navs_type(params) {
  return request({
    url: `/lmp/v2/admin/store_nav/mini_type`,
    method: 'get',
    params
  })
}

export function setNavsSetting(data) {
  return request({
    url: '/lmp/v2/admin/store_nav/mini',
    method: 'post',
    data
  })
}

export default { home, save_mini_home, navs_setting, navs_type, setNavsSetting }
