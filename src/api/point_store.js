import request from '@/utils/request'

export function detail(params) {
  return request({
    url: '/lmp/v2/admin/store/point_store',
    method: 'get',
    params
  })
}
export function navs_setting(params) {
  return request({
    url: '/lmp/v2/admin/store_nav',
    method: 'get',
    params
  })
}

export function setNavsSetting(data) {
  return request({
    url: '/lmp/v2/admin/store_nav',
    method: 'post',
    data
  })
}

export function point_store_theme(params) {
  return request({
    url: '/lmp/v2/admin/store/point_store_theme',
    method: 'get'
  })
}

export function navs_type(params) {
  return request({
    url: '/lmp/v2/admin/store_nav/type',
    method: 'get'
  })
}
export function edit_point_store_theme(data) {
  return request({
    url: '/lmp/v2/admin/store/point_store_theme',
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data.theme
  })
}
export function edit_point_store_page(data) {
  return request({
    url: `/lmp/v2/admin/store/point_store_home`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data.id)
  })
}
export function get_point_setting(params) {
  return request({
    url: `/lmp/v2/admin/store/point_setting`,
    method: 'get',
    params
  })
}
export function edit_point_setting(data) {
  return request({
    url: `/lmp/v2/admin/store/point_setting_edit`,
    method: 'post',
    data
  })
}
export function clear_user_point(data) {
  return request({
    url: `/lmp/v2/admin/store/clear_user_point`,
    method: 'put',
    data
  })
}
export function point_store_user_tags(params) {
  return request({
    url: `/lmp/v2/admin/store/point_store/user_tags`,
    method: 'get',
    params
  })
}
export function point_store_user_tags_setting(data) {
  return request({
    url: `/lmp/v2/admin/store/point_store/user_tags`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data.tagIds)
  })
}
export function functions(params) {
  return request({
    url: '/lmp/v2/admin/store/functions',
    method: 'get',
    params
  })
}

export default {
  detail,
  navs_setting,
  setNavsSetting,
  point_store_theme,
  navs_type,
  edit_point_store_theme,
  edit_point_store_page,
  get_point_setting,
  edit_point_setting,
  clear_user_point,
  point_store_user_tags,
  point_store_user_tags_setting,
  functions
}
