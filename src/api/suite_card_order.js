import request from '@/utils/request'
export function get(params) {
  return request({
    url: `/lmp/v2/admin/suite_card_order/${params.code}`,
    method: 'get'
  })
}
export function deliver(data) {
  return request({
    url: `/lmp/v2/admin/suite_card_order/${data.code}/deliver`,
    method: 'put',
    data
  })
}
export function note(data) {
  return request({
    url: `/lmp/v2/admin/suite_card_order/${data.code}/note`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data.note
  })
}
export function confirm(data) {
  return request({
    url: `/lmp/v2/admin/suite_card_order/${data.code}/confirm`,
    method: 'put',
    data
  })
}

export default { get, deliver, note, confirm }
