import request from '@/utils/request'
export function rule(params) {
  return request({
    url: `/lmp/v2/admin/intelligent_tag_rule/rule_list`,
  })
}

export default { rule }
