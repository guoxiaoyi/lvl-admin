import request from '@/utils/request'
import qs from 'qs'
import { Promise } from 'core-js'

export function login(data) {
  return new Promise((resolve, reject) => {
    resolve({ data: { token: 'OHJ6eE94VTBJL1lqWFhtZnFCREord3VPT0JFaTIyRXR5bUtIQzlpWkY4dXU5encxclhrSEtUQVI3WGQvNTFwUUhRMFlteE16eldnVmtoam9xUHhDRTNMQUdpbmtJUTZ5MGRKQkpyMENncmtHbWRUT3hrWDE2OXNPb0Y3dzB6Z0Z5bnl3WmpVeHVsRmFzQ2FnSEc4ckpGbVJ0N282WmMwcEFBMHFhTnNrQXl0bGNnOTc1czJ1SXZxMkV5VWFIbFdjek1CZEh2V3V2RVBqanZ1OXBsM1krZk9Nc1N3M0t0OEgvZnpxL3Nic3loT3llVFZDYXNXemptWlFaZ1M4RUJzbHQ5NFVYVkNrQW9MbDMzcDZkMzR1a1dzSkVVd3dkYk56OXVSbDVyS2Myd2pmdU12czZ1VHk4QjNhMjhiMlUxYWt1T3g2UnFkNjh0QitCcSs1UC9NWlVTbWMyUitiZ3czTjlpWDQrL2d6aVZLR3VkcnQ2SW5IQTFWVUhuaExpa3RnLS1sSFhKNVgvTEN5eW9zVHNhaUVqaTFRPT0=--07466a270b872f0f63dec73835c3cfeef457942d' }})
  })
  // return request({
  //   url: '/user/login',
  //   method: 'post',
  //   data
  // })
}

export function getInfo() {
  return request({
    url: '/lmp/v2/admin/auth/info',
    method: 'get'
  })
}

export function getPreviewInfo() {
  return request({
    url: '/lmp/v2/admin/auth/navbar_preview_info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/sessions/ajax_logout',
    method: 'delete'
  })
}

export function code(phone) {
  return request({
    url: `/lmp/v2/admin/allow/sms/sendCode`,
    method: 'post',
    params: { phone }
  })
}

export function v2_code(params) {
  return request({
    url: `/lmp/v2/admin/smsCode/sendCode`,
    method: 'post',
    params
  })
}

export function remove_blacklist(data) {
  return request({
    url: `/lmp/v2/admin/user/${data.id}/remove_blacklist`,
    method: 'put',
    data
  })
}
export function join_blacklist(data) {
  return request({
    url: `/lmp/v2/admin/user/${data.id}/join_blacklist`,
    method: 'put',
    data
  })
}

export function show(params) {
  return request({
    url: `/lmp/v2/admin//user/${params.userId}`
  })
}

export function remove_tags(data) {
  return request({
    url: `/lmp/v2/admin/user/remove_tags`,
    method: 'post',
    data
  })
}

export function add_tags(data) {
  return request({
    url: `/lmp/v2/admin/user/add_tags`,
    method: 'post',
    data
  })
}

export function activity_remove_tags(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/user/remove_tags`,
    method: 'post',
    data
  })
}

export function activity_add_tags(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/user/add_tags`,
    method: 'post',
    data
  })
}
export function download(params) {
  return request({
    url: `/lmp/v2/admin/user/es/export?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function del_for_blacked(data) {
  return request({
    url: `/lmp/v2/admin/blocked_phone`,
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data)
  })
}
export function del_for_blacked_all(data) {
  return request({
    url: `/lmp/v2/admin/blocked_phone/delete_all`,
    method: 'delete',
    data
  })
}
export function join_blacklist_batch(data) {
  return request({
    url: `/lmp/v2/admin/user/join_blacklist/batch`,
    method: 'put',
    data
  })
}
export function edit_tag(data) {
  return request({
    url: `/lmp/v2/admin/user/${data.id}/edit_tag`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data.tagId)
  })
}

export function edit_points(data) {
  return request({
    url: `/lmp/v2/admin/user/${data.id}/edit_points`,
    method: 'put',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/user/${data.id}`,
    method: 'put',
    data
  })
}

export function indexEs(params) {
  return request({
    url: `/lmp/v2/admin/user/es?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function list_info(params) {
  return request({
    url: `/lmp/v2/admin/user/list_info/${params.id}`,
    method: 'get'
  })
}

export default { indexEs, logout, code, v2_code, remove_blacklist, join_blacklist, show, remove_tags, activity_remove_tags,
  activity_add_tags, add_tags, download, del_for_blacked, del_for_blacked_all, join_blacklist_batch, edit_tag, edit_points, edit, getPreviewInfo, list_info }
