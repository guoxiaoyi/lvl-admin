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
    url: '/lmp/v2/admin/gift_goods/select?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function get(params) {
  return request({
    url: `/lmp/v2/admin/award_order/${params.code}`,
    method: 'get'
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

export function edit_deliver(data) {
  return request({
    url: `/lmp/v2/admin/award_order/${data.code}/logistics`,
    method: 'put',
    data
  })
}

export function logistics(params) {
  return request({
    url: `/lmp/v2/admin/award_order/${params.code}/logistics`
  })
}

export function resend(data) {
  return request({
    url: `/lmp/v2/admin/award_order/delivering_failed?` + qs.stringify(data, { indices: false }),
    method: 'post'
  })
}

export function close_failed(data) {
  return request({
    url: `/lmp/v2/admin/award_order/close_failed?` + qs.stringify(data, { indices: false }),
    method: 'post'
  })
}

export function batch_confirm(data) {
  return request({
    url: `/lmp/v2/admin/award_order/batch_confirm?` + qs.stringify(data, { indices: false }),
    method: 'put'
  })
}
export function close(params) {
  return request({
    url: `/lmp/v2/admin/award_order/${params.code}/close`,
    method: 'put',
    params
  })
}

export function delivering_failed_single(data) {
  return request({
    url: `/lmp/v2/admin/award_order/${data.code}/redelivery`,
    method: 'put',
    data
  })
}

export function note(data) {
  return request({
    url: `/lmp/v2/admin/award_order/${data.code}/note`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data.note
  })
}

export default { list, goods, get, download, confirm, deliver, edit_deliver, logistics, resend, close_failed, batch_confirm, close, delivering_failed_single, note }
