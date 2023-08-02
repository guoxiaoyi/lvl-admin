import request from '@/utils/request'
import qs from 'qs'

export function index(params) {
  return request({
    url: '/lmp/admin/api/channel',
    method: 'get',
    params
  })
}

export function get(params) {
  return request({
    url: `/lmp/admin/api/channel/${params.id}`,
    method: 'get'
  })
}

export function type() {
  return request({
    url: '/lmp/admin/api/channel/type',
    method: 'get'
  })
}

export function all(params) {
  return request({
    url: '/lmp/admin/api/channel/all?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/lmp/admin/api/channel',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: `/lmp/admin/api/channel/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/admin/api/channel/${data.id}`,
    method: 'delete'
  })
}
export function update_parent(data) {
  return request({
    url: `/lmp/admin/api/channel/update_parent`,
    method: 'put',
    data
  })
}
export function update_type(data) {
  return request({
    url: `/lmp/admin/api/channel/update_type`,
    method: 'put',
    data
  })
}
export function download(params) {
  return request({
    url: `/lmp/admin/api/channel/download?` + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
export function next(params) {
  return request({
    url: '/lmp/v2/admin/channel/next',
    params
  })
}
export default { index, type, all, add, edit, get, del, update_parent, update_type, download, next }
