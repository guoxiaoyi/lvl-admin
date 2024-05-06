import request from '@/utils/request'
export function rule(params) {
  return request({
    url: `/lmp/v2/admin/intelligent_tag_rule/rule_list`,
  })
}

export function add(data) {
  return request({
    url: `/lmp/v2/admin/intelligent_tag_rule`,
    method: 'POST',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/intelligent_tag_rule/${data.id}`,
    method: 'PUT',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/intelligent_tag_rule/${data.id}`,
    method: 'delete',
    data
  })
}
export function show(params) {
  return request({
    url: `/lmp/v2/admin/intelligent_tag_rule/${params.id}`
  })
}
export function process(data) {
  return request({
    url: `/lmp/v2/admin/intelligent_tag_rule/${data.id}/process`,
    method: 'PUT',
    data
  })
}
export function switch_state(data) {
  return request({
    url: `/lmp/v2/admin/intelligent_tag_rule/${data.id}/switch_state`,
    method: 'PUT',
    data
  })
}

export default { rule, add, del, edit, show, process, switch_state }
