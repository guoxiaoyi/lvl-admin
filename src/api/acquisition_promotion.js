import request from '@/utils/request'

export function source_type(data) {
  return request({
    url: `/lmp/v2/admin/acquisition_promotion/source_type`
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/acquisition_promotion`,
    method: 'post',
    data
  })
}
export function switch_state(data) {
  return request({
    url: `/lmp/v2/admin/acquisition_promotion/${data.id}/switch_state`,
    method: 'put'
  })
}

export default { source_type, add, switch_state }
