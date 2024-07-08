import request from '@/utils/request'

export function index(params) {
  return request({
    url: '/lmp/v2/admin/spec_dict',
    params
  })
}
export function list(params) {
  return request({
    url: '/lmp/v2/admin/spec_dict/list',
    params
  })
}

export function type(params) {
  return request({
    url: '/lmp/v2/admin/spec_dict/type',
    params
  })
}

export function add(data) {
  return request({
    url: '/lmp/v2/admin/spec_dict',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/spec_dict/${data.id}`,
    method: 'delete',
    data
  })
}

export default { index, list, type, add, del }
