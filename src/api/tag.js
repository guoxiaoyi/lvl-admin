import request from '@/utils/request'
export function all(params) {
  return request({
    url: '/lmp/admin/api/tag/all',
    method: 'get',
    params
  })
}

export function list(params) {
  return request({
    url: '/lmp/admin/api/tag',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/lmp/admin/api/tag',
    method: 'post',
    data
  })
}

export default { all, list, add }
