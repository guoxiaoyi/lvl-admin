import request from '@/utils/request'
import qs from 'qs'
export function notice(params) {
  return request({
    url: '/lgp/admin/api/cms/article/notice' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
export function video(params) {
  return request({
    url: '/lgp/admin/api/cms/article/video' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
export function enabled_total(params) {
  return request({
    url: '/lmp/v2/admin/activity/enabled_total',
    method: 'get'
  })
}
export function delivery_failed_total(params) {
  return request({
    url: '/lmp/v2/admin/award_order/delivery_failed_total',
    method: 'get'
  })
}
export function stock_quantity_warning_total(params) {
  return request({
    url: '/lmp/v2/admin/activity_goods/stock_quantity_warning_total',
    method: 'get'
  })
}

export default { notice, video, enabled_total, delivery_failed_total, stock_quantity_warning_total }
