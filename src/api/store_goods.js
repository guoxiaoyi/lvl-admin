import request from '@/utils/request'
export function getGoods(params) {
  return request({
    url: '/lmp/v2/admin/goods',
    method: 'get',
    params
  })
}

export function index(params) {
  return request({
    url: `/lmp/v2/admin/store_goods`,
    method: 'get',
    params
  })
}

export function show(params) {
  return request({
    url: `/lmp/v2/admin/store_goods/${params.id}`,
    method: 'get'
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/store_goods/${data.id}`,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/store_goods/${data.id}`,
    method: 'put',
    data
  })
}

export function add(data) {
  return request({
    url: `/lmp/v2/admin/store_goods`,
    method: 'post',
    data
  })
}

export function grouping(data) {
  return request({
    url: `/lmp/v2/admin/group/groupings/batch`,
    method: 'post',
    data
  })
}
export function on_sale(data) {
  return request({
    url: `/lmp/v2/admin/store_goods/batch/on_sale`,
    method: 'put',
    data
  })
}

export function increase_stock(data) {
  return request({
    url: `/lmp/v2/admin/store_goods/${data.goodsId}/increase_stock`,
    method: 'post',
    data
  })
}

export function decrease_stock(data) {
  return request({
    url: `/lmp/v2/admin/store_goods/${data.goodsId}/decrease_stock`,
    method: 'post',
    data
  })
}

export function add_coupon(data) {
  return request({
    url: `/lmp/v2/admin/goods/${data.goodsId}/coupons/import_text`,
    method: 'post',
    data
  })
}

export function clear_stock_change(data) {
  return request({
    url: `/lmp/v2/admin/store_goods/${data.goodsId}/clear_stock`,
    method: 'put',
    data
  })
}

export function type(params) {
  return request({
    url: `/lmp/v2/admin/store_goods/type`,
    method: 'get',
    params
  })
}
export function stock_quantity_warning_total(params) {
  return request({
    url: `/lmp/v2/admin/store_goods/stock_quantity_warning_total`,
    method: 'get',
    params
  })
}

export default {
  index,
  show,
  add,
  grouping,
  on_sale,
  increase_stock,
  decrease_stock,
  clear_stock_change,
  add_coupon,
  type,
  del,
  edit,
  stock_quantity_warning_total
}
