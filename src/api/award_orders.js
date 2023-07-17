import request from '@/utils/request'
import qs from 'qs'

export function list(params) {
  return request({
    url: '/lmp/v2/admin/award_order/es?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
export function goods(params) {
  return request({
    url: '/lmp/v2/admin/award_order/gift_goods',
    method: 'get',
    params
  })
}

export function download(params) {
  delete params.searchAfter
  return request({
    url: '/lmp/v2/admin/award_order/es/export?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function confirm(data) {
  return request({
    url: `/lmp/v2/admin/award_order/${data.code}/confirm`,
    method: 'put',
    data
  })
}
export function deliver(data) {
  return request({
    url: `/lmp/v2/admin/award_order/${data.code}/deliver`,
    method: 'put',
    data
  })
}

export function resend(data) {
  return request({
    url: `/lmp/v2/admin/award_order/delivering_failed?` + qs.stringify(data, { indices: false }),
    method: 'post',
    data
  })
}

export function close_failed(data) {
  return request({
    url: `/lmp/v2/admin/award_order/close_failed?` + qs.stringify(data, { indices: false }),
    method: 'post',
    data
  })
}

export default { list, goods, download, confirm, deliver, resend, close_failed }
