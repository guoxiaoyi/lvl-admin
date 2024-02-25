import request from '@/utils/request'

export function index(params) {
  params = { onSale: true, ...params }
  return request({
    url: '/lgp/admin/api/gift',
    method: 'get',
    params
  })
}

export function show(params) {
  return request({
    url: `/lgp/admin/api/gift/info/${params.id}`,
    method: 'get'
  })
}

export function getGiftProvider(params) {
  return request({
    url: '/lmp/admin/api/gift/provider',
    method: 'get',
    params
  })
}

export function categories(params) {
  return request({
    url: '/lgp/admin/api/gift/category',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/lgp/admin/api/goods',
    method: 'post',
    data
  })
}

export function getGiftInfo(params) {
  return request({
    url: `/lmp/admin/api/gift/info/${params.id}`,
    method: 'get'
  })
}

export default { categories, index, show, add }
