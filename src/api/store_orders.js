import request from '@/utils/request'
import qs from 'qs'
export function show(params) {
  return request({
    url: `/lmp/v2/admin/store_order/${params.id}`,
    method: 'get'
  })
}
export function count(params) {
  return request({
    url: `/lmp/v2/admin/store_order/count?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
export function delivering_failed(data) {
  return request({
    url: `/lmp/v2/admin/store_order/delivering_failed`,
    method: 'post',
    data
  })
}

export function delivering_failed_single(data) {
  return request({
    url: `/lmp/v2/admin/store_order/${data.code}/redelivery`,
    method: 'put',
    data: {}
  })
}

export function close(data) {
  return request({
    url: `/lmp/v2/admin/store_order/${data.code}/close`,
    method: 'put',
    data
  })
}

export function logistics(params) {
  return request({
    url: `/lmp/v2/admin/store_order/${params.code}/logistics`,
    method: 'get',
    params
  })
}

export function deliver(data) {
  return request({
    url: `/lmp/v2/admin/store_order/${data.code}/deliver`,
    method: 'put',
    data
  })
}

export function edit_logistics(data) {
  return request({
    url: `/lmp/v2/admin/store_order/${data.code}/logistics`,
    method: 'put',
    data
  })
}

export function note(data) {
  return request({
    url: `/lmp/v2/admin/store_order/${data.id}/note`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data.note
  })
}

export function download(params) {
  return request({
    url: `/lmp/v2/admin/store_order/download?` + qs.stringify(params, { indices: false }),
    method: 'post'
  })
}

export function resend(data) {
  return request({
    url: `/lmp/v2/admin/store_order/delivering_failed?` + qs.stringify(data, { indices: false }),
    method: 'post',
    data
  })
}

export function close_failed(data) {
  return request({
    url: `/lmp/v2/admin/store_order/close_failed?` + qs.stringify(data, { indices: false }),
    method: 'post',
    data
  })
}

export function confirm(data) {
  return request({
    url: `/lmp/v2/admin/store_order/${data.code}/confirm`,
    method: 'put',
    data
  })
}

export default { show, count, delivering_failed, close, logistics, deliver, note, edit_logistics, download, resend, confirm, close_failed, delivering_failed_single }
