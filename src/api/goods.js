import request from '@/utils/request'
import qs from 'qs'

export function postGoods(data) {
  return request({
    url: '/lmp/admin/api/goods',
    method: 'post',
    data
  })
}

export function index(params) {
  return request({
    url: '/lmp/v2/admin/gift_goods?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function rebater_goods(params) {
  return request({
    url: '/lmp/admin/api/goods/rebater',
    method: 'get',
    params
  })
}

export function types(params) {
  return request({
    url: `/lmp/v2/admin/gift_goods/type`,
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: `/lmp/v2/admin/gift_goods`,
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/gift_goods/${data.id}`,
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/gift_goods/${data.id}`,
    method: 'delete',
    data
  })
}
export function show(params) {
  return request({
    url: `/lmp/v2/admin/gift_goods/${params.id}`,
    method: 'get',
    params
  })
}
export function increase_stock(data) {
  return request({
    url: `/lmp/v2/admin/gift_goods/${data.goodsId}/increase_stock`,
    method: 'post',
    data
  })
}

export function decrease_stock(data) {
  return request({
    url: `/lmp/v2/admin/gift_goods/${data.goodsId}/decrease_stock`,
    method: 'post',
    data
  })
}
export function clear_stock_change(data) {
  return request({
    url: `/lmp/v2/admin/gift_goods/${data.goodsId}/clear_stock`,
    method: 'put',
    data
  })
}
export function top(data) {
  return request({
    url: `/lmp/v2/admin/gift_goods/top`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data.ids)
  })
}
export function down(data) {
  return request({
    url: `/lmp/v2/admin/gift_goods/cancel_top`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data.ids)
  })
}
export function stock_quantity_warning_total(data) {
  return request({
    url: `/lmp/v2/admin/gift_goods/stock_quantity_warning_total`,
    method: 'get'
  })
}
export function download(data) {
  return request({
    url: `/lmp/v2/admin/goods/${data.goodsId}/download`,
    method: 'post',
    data
  })
}

export default { types, add, edit, show, increase_stock, decrease_stock, clear_stock_change, del, top, down, stock_quantity_warning_total, index, download }
