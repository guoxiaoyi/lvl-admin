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

export function chinaGeo(code = 100000) {
  return request({
    url: `/lmp/v2/admin/stats/award_order/area_json/${code}`,
    method: 'get'
  })
}

export function award_order_gift_rankings(params) {
  return request({
    url: `/lmp/v2/admin/stats/award_order/award_order_gift_rankings?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function activity_rankings(params) {
  return request({
    url: `/lmp/v2/admin/stats/award_order/activity_rankings?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function gender(params) {
  return request({
    url: `/lmp/v2/admin/stats/user/gender?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
export function new_old_user_distribution(params) {
  return request({
    url: `/lmp/v2/admin/stats/user/new_old_user_distribution?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function invite_vip_register_order_summary(params) {
  return request({
    url: `/lmp/v2/admin/stats/invite_vip_register_order/summary?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
export function invite_vip_register_order_summary_top(params) {
  return request({
    url: `/lmp/v2/admin/stats/invite_vip_register_order/top?`,
    method: 'get'
  })
}
export function invite_vip_register_order_invite_record(params) {
  return request({
    url: `/lmp/v2/admin/stats/invite_vip_register_order/${params.userId}/invite_record`,
    method: 'get'
  })
}

export const channel = {
  type: function(params) {
    return request({
      url: `/lmp/v2/admin/stats/channel/summary_data/type?` + qs.stringify(params, { indices: false }),
      method: 'get'
    })
  },
  province: function(params) {
    return request({
      url: `/lmp/v2/admin/stats/channel/summary_data/province?` + qs.stringify(params, { indices: false }),
      method: 'get'
    })
  },
  register: function(params) {
    return request({
      url: `/lmp/v2/admin/stats/channel/summary_data/register_data?` + qs.stringify(params, { indices: false }),
      method: 'get'
    })
  },
  area_data: function(params) {
    return request({
      url: `/lmp/v2/admin/stats/channel/area_data?` + qs.stringify(params, { indices: false }),
      method: 'get'
    })
  }
}

export default {
  award_order_orders,
  red_pack_exchange_amount_total,
  user_locations,
  locations,
  user_add,
  store_order_statistics,
  store_order_goods_ranking,
  user_rankings,
  chinaGeo,
  award_order_gift_rankings,
  activity_rankings,
  gender,
  new_old_user_distribution,
  invite_vip_register_order_summary,
  invite_vip_register_order_summary_top,
  channel
}
