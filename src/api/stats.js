import request from '@/utils/request'
import qs from 'qs'

export function award_order_orders(params) {
  return request({
    url: '/lmp/v2/admin/stats/award_order/orders?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function red_pack_exchange_amount_total(params) {
  return request({
    url: '/lmp/v2/admin/red_pack_exchange/amount_total?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { award_order_orders, red_pack_exchange_amount_total }
