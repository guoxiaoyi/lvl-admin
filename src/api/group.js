import request from '@/utils/request'

export function index(params) {
  return request({
    url: '/lmp/v2/admin/group',
    method: 'get',
    params
  })
}

export function getGroupGoods(params) {
  return request({
    url: `/lmp/v2/admin/group/${params.id}/groupings`,
    method: 'get',
    params
  })
}

export function groupGoodsSort(data) {
  return request({
    url: `/lmp/v2/admin/group/${data.groupId}/groupings/${data.id}`,
    method: 'put',
    data
  })
}

export function add(data) {
  return request({
    url: '/lmp/v2/admin/group',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/group/${data.id}`,
    method: 'delete',
    data
  })
}

export function delGrouping(data) {
  return request({
    url: `/lmp/v2/admin/deleteGrouping/${data}`,
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/group/${data.id}`,
    method: 'put',
    data
  })
}

export function show(params) {
  return request({
    url: `/lmp/v2/admin/${params.id}/grouping`,
    method: 'get'
  })
}

// /group/{groupId}/groupings/{goodsId}
export function add_product_in_group(data) {
  return request({
    url: `/lmp/v2/admin/group/${data.id}/groupings/${data.goodsId}`,
    method: 'post',
    data
  })
}
export function remove_product_in_group(data) {
  return request({
    url: `/lmp/v2/admin/group/${data.id}/groupings/${data.goodsId}`,
    method: 'delete',
    data
  })
}

export default { index, getGroupGoods, groupGoodsSort, add, edit, del, show, delGrouping, add_product_in_group, remove_product_in_group }
