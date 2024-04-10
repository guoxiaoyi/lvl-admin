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
export function url(params) {
  return request({
    url: `/lmp/v2/admin/acquisition_promotion/${params.id}/promotion_url`
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/acquisition_promotion/${data.id}`,
    method: 'delete'
  })
}

export default { source_type, add, switch_state, url, del }
