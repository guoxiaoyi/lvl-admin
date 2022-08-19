import request from '@/utils/request'

export function del(data) {
  return request({
    url: `/lmp/admin/api/t_unit_batch/${data.id}/t_units/delete`,
    method: 'delete'
  })
}

export default { del }
