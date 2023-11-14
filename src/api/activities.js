import request from '@/utils/request'
import qs from 'qs'

export function list_new(params) {
  return request({
    url: '/lmp/v2/admin/activity/page_kinds'
  })
}

export function prepare(data) {
  return request({
    url: '/lmp/v2/admin/activity/prepare',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/lmp/v2/admin/activity',
    method: 'post',
    data
  })
}

export function add_child(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.parentId}/child`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}`,
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/base_edit`,
    method: 'post',
    data
  })
}
export function confirm(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/confirm`,
    method: 'post',
    data
  })
}

export function list(params) {
  return request({
    url: '/lmp/v2/admin/activity',
    method: 'get',
    params
  })
}

export function all(params) {
  return request({
    url: '/lmp/v2/admin/activity/list',
    method: 'get',
    params
  })
}

export function restore(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/restore`,
    method: 'put',
    data
  })
}

export function real_delete(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/real_delete`,
    method: 'delete',
    data
  })
}

export function pageType(params) {
  return request({
    url: `/lmp/v2/admin/activity/page_types`,
    method: 'get',
    params
  })
}

export function show(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.id}`,
    method: 'get'
  })
}

export function user_export(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.id}/user/export?` + qs.stringify(params,
      { indices: false })
  })
}

export function type(params) {
  return request({
    url: `/lmp/v2/admin/activity/types`,
    method: 'get'
  })
}

export function awards_position(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/awards/${data.id}/position/${data.newPosition}`,
    method: 'put'
  })
}
export function awards_type(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.activityId}/awards/award_type`,
    method: 'get'
  })
}
export function awards_all_type(params) {
  return request({
    url: `/lmp/v2/admin/activity/awards/award_types`,
    method: 'get'
  })
}
export function base_info(params) {
  return request({
    url: `/lmp/v2/admin/activity/${params.id}/base_info`
  })
}
export function update_tags(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/update_tags`,
    method: 'post',
    data
  })
}
export function amount_increment(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/amount_increment`,
    method: 'post',
    data
  })
}
export function amount_increment_trace(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/amount_increment_trace`,
    method: 'post',
    data
  })
}
export function toggle_paused(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/toggle_paused`,
    method: 'post',
    data
  })
}
export function batch_update_end_time(data) {
  return request({
    url: `/lmp/v2/admin/activity/batch_update_end_time`,
    method: 'post',
    data
  })
}
export function batch_update_tags(data) {
  return request({
    url: `/lmp/v2/admin/activity/batch_update_tags`,
    method: 'post',
    data
  })
}
export function cancel_top(data) {
  return request({
    url: `/lmp/v2/admin/activity/cancel_top`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data.map(i => i.id))
  })
}
export function top(data) {
  return request({
    url: `/lmp/v2/admin/activity/top`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data.map(i => i.id))
  })
}
export function duplicate(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.id}/duplicate`,
    method: 'put',
    data
  })
}
export function downloadForm(data) {
  return request({
    url: `/lmp/v2/admin/activity/${data.activityId}/activity_form/download`,
    method: 'post',
    data
  })
}

export function typeKind(data) {
  return request({
    url: `/lmp/v2/admin/activity/types`
  })
}
export default {
  list,
  list_new,
  restore,
  real_delete,
  pageType,
  show,
  all,
  type,
  user_export,
  add,
  del,
  edit,
  awards_position,
  awards_type,
  awards_all_type,
  base_info,
  confirm,
  update_tags,
  amount_increment,
  amount_increment_trace,
  toggle_paused,
  batch_update_end_time,
  batch_update_tags,
  cancel_top,
  top,
  duplicate,
  prepare,
  add_child,
  downloadForm,
  typeKind
}
