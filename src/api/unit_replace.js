import request from '@/utils/request'
export function add(data) {
  return request({
    url: '/lmp/v2/admin/unit_replace/replace',
    method: 'put',
    data
  })
}

export default { add }
