import request from '@/utils/request'
import qs from 'qs'
export function index(params) {
  return request({
    url: '/lmp/v2/admin/invite_vip_register_order' + qs.stringify(params, { indices: false }),
  })
}


export function get(params) {
  return request({
    url: `/lmp/v2/admin/invite_vip_register_order/${params.code}`
  })
}

export function delivering_failed(data) {
  return request({
    url: '/lmp/v2/admin/invite_vip_register_order/delivering_failed',
    method: 'post',
    data
  })
}

export function batch_submit(data) {
  return request({
    url: '/lmp/v2/admin/invite_vip_register_order/batch_submit',
    method: 'post',
    data
  })
}

export function submit(data) {
  return request({
    url: `/lmp/v2/admin/invite_vip_register_order/${data.code}/submit`,
    method: 'put'
  })
}
export function pay(data) {
  return request({
    url: `/lmp/v2/admin/invite_vip_register_order/${data.code}/pay`,
    method: 'put'
  })
}

export function confirm(data) {
  return request({
    url: `/lmp/v2/admin/invite_vip_register_order/${data.code}/confirm`,
    method: 'put'
  })
}

export function close(data) {
  return request({
    url: `/lmp/v2/admin/invite_vip_register_order/${data.code}/close`,
    method: 'put'
  })
}

export function note(data) {
  return request({
    url: `/lmp/v2/admin/invite_vip_register_order/${data.code}/note`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data.note
  })
}

export default { index, get, delivering_failed, batch_submit, submit, confirm, close, note, pay }
