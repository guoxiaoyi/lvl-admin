import request from '@/utils/request'

export function getGroup(params) {
  return request({
    url: '/api/group',
    method: 'get',
    params
  })
}
export function getGroupGoods(params) {
  return request({
    url: '/api/group/goods',
    method: 'get',
    params
  })
}
export function groupGoodsSort(data) {
  return request({
    url: '/api/group/goods/sort',
    method: 'post',
    data
  })
}
export function addGroup(data) {
  return request({
    url: '/api/group',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/api/group',
    method: 'delete',
    data
  })
}
export function delGrouping(data) {
  return request({
    url: `/api/group/deleteGrouping/${data}`,
    method: 'delete',
    data
  })
}
export function updateGroup(data) {
  return request({
    url: '/api/group',
    method: 'put',
    data
  })
}
export function addGoodsToGroup(data) {
  return request({
    url: '/api/group/addGoods',
    method: 'post',
    data
  })
}
export function show(params) {
  return request({
    url: `/api/group/info/${params.id}`,
    method: 'get',
  })
}

export default { getGroup, getGroupGoods, groupGoodsSort, addGroup, updateGroup, del, show, delGrouping, addGoodsToGroup }
