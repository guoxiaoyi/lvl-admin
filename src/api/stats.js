import request from '@/utils/request'
import qs from 'qs'

export function award_order_orders(params) {
  return request({
    url: '/lmp/v2/admin/stats/award_order/orders?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function user_rankings(params) {
  return request({
    url: '/lmp/v2/admin/stats/award_order/user_rankings?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function red_pack_exchange_amount_total(params) {
  return request({
    url: '/lmp/v2/admin/red_pack_exchange/amount_total?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function user_locations(params) {
  return request({
    url: '/lmp/v2/admin/stats/user/locations?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function locations(params) {
  return request({
    url: '/lmp/v2/admin/stats/award_order/locations?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function user_add(params) {
  return request({
    url: '/lmp/v2/admin/stats/user/add?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function store_order_statistics(params) {
  return request({
    url: '/lmp/v2/admin/store_order/statistics?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function store_order_goods_ranking(params) {
  return request({
    url: '/lmp/v2/admin/store_order/goods_ranking?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { award_order_orders, red_pack_exchange_amount_total, user_locations, locations, user_add, store_order_statistics, store_order_goods_ranking, user_rankings }
