import request from '@/utils/request'
import qs from 'qs'

export function all() {
  return request({
    url: '/lmp/admin/api/product/all',
    method: 'get'
  })
}

export function index() {
  return request({
    url: '/lmp/admin/api/product',
    method: 'get'
  })
}

export function show(id) {
  return request({
    url: `/lmp/admin/api/product/${id}`,
    method: 'get'
  })
}

export default { all, index, show }
