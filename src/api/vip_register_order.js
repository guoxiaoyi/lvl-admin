import request from '@/utils/request'
import qs from 'qs'

export function get(params) {
  return request({
    url: `/lmp/v2/admin/vip_register_order/${params.code}`,
    method: 'get',
    params
  })
}
export function note(data) {
  return request({
    url: `/lmp/v2/admin/vip_register_order/${data.code}/note`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data.note
  })
}
export function batch_submit(data) {
  return request({
    url: `/lmp/v2/admin/vip_register_order/batch_submit`,
    method: 'post',
    data
  })
}

export function resend(data) {
  return request({
    url: `/lmp/v2/admin/vip_register_order/delivering_failed?` + qs.stringify(data, { indices: false }),
    method: 'post'
  })
}

export function close_failed(data) {
  return request({
    url: `/lmp/v2/admin/vip_register_order/close_failed?` + qs.stringify(data, { indices: false }),
    method: 'post'
  })
}
export function download(data) {
  return request({
    url: '/lmp/v2/admin/vip_register_order/download?' + qs.stringify(data, { indices: false }),
    method: 'post'
  })
}

export function submit(data) {
  return request({
    url: `/lmp/v2/admin/vip_register_order/${data.code}/submit`,
    method: 'put'
  })
}

export function confirm(data) {
  return request({
    url: `/lmp/v2/admin/vip_register_order/${data.code}/confirm`,
    method: 'put',
    data
  })
}

export function delivering_failed_single(data) {
  return request({
    url: `/lmp/v2/admin/vip_register_order/${data.code}/redelivery`,
    method: 'put',
    data
  })
}

export function close(params) {
  return request({
    url: `/lmp/v2/admin/vip_register_order/${params.code}/close`,
    method: 'put',
    params
  })
}

export default { get, note, batch_submit, resend, close_failed, download, confirm, delivering_failed_single, submit, close }
