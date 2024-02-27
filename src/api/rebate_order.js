import request from '@/utils/request'
import qs from 'qs'
export function get(params) {
  return request({
    url: `/lmp/v2/admin/rebate_order/${params.code}`,
    method: 'get',
    params
  })
}

export function batch_submit(data) {
  return request({
    url: '/lmp/v2/admin/rebate_order/batch_submit',
    method: 'post',
    data
  })
}

export function download(data) {
  return request({
    url: '/lmp/v2/admin/rebate_order/download',
    method: 'post',
    data
  })
}
export function resend(data) {
  return request({
    url: '/lmp/v2/admin/rebate_order/delivering_failed',
    method: 'post',
    data
  })
}
export function close_failed(data) {
  return request({
    url: '/lmp/v2/admin/rebate_order/close_failed',
    method: 'post',
    data
  })
}

export function goods(params) {
  return request({
    url: '/lmp/v2/admin/gift_goods/select?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function submit(data) {
  return request({
    url: `/lmp/v2/admin/rebate_order/${data.code}/submit`,
    method: 'put'
  })
}

export function confirm(data) {
  return request({
    url: `/lmp/v2/admin/rebate_order/${data.code}/confirm`,
    method: 'put',
    data
  })
}

export function delivering_failed_single(data) {
  return request({
    url: `/lmp/v2/admin/rebate_order/${data.code}/redelivery`,
    method: 'put',
    data
  })
}

export function note(data) {
  return request({
    url: `/lmp/v2/admin/rebate_order/${data.code}/note`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data.note
  })
}
export function close(params) {
  return request({
    url: `/lmp/v2/admin/rebate_order/${params.code}/close`,
    method: 'put',
    params
  })
}


export default { get, batch_submit, download, resend, close_failed, goods, submit, confirm, delivering_failed_single, note, close }
