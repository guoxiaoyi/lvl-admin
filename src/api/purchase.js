import request from '@/utils/request'

export function sms_purchase(data) {
  return request({
    url: '/lmp/v2/admin/purchase/sms_purchase',
    method: 'post',
    data
  })
}

export function logistics_purchase(data) {
  return request({
    url: '/lmp/v2/admin/purchase/logistics_purchase',
    method: 'post',
    data
  })
}

export function sms_service(params) {
  return request({
    url: '/lmp/v2/admin/lfl_service/sms_service',
    method: 'get',
    params
  })
}

export function logistics_service(params) {
  return request({
    url: '/lmp/v2/admin/lfl_service/logistics_service',
    method: 'get',
    params
  })
}

export default { sms_purchase, logistics_purchase, sms_service, logistics_service }
