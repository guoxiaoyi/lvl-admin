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

export default { rule, add, edit }
