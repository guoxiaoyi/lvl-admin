import request from '@/utils/request'

export function add(data) {
  return request({
    url: `/lmp/v2/admin/t_unit_export/level`,
    method: 'post',
    data
  })
}

export default { add }
