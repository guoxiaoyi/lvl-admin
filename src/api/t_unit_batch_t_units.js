import request from '@/utils/request'

export function del(data) {
  return request({
    url: `/lmp/admin/api/t_unit_batch/${data.origin.unitBatchId}/t_units/delete/${data.origin.snText}`,
    method: 'delete'
  })
}

export function t_units_unpack(params) {
  return request({
    url: `/lmp/admin/api/t_unit/${params.sn}/unpack`,
    method: 'get',
    params
  })
}

export default { del, t_units_unpack }
