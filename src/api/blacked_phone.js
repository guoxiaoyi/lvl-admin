import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/lmp/v2/admin/blocked_phone',
    method: 'post',
    data
  })
}
export function upload(data) {
  return request({
    url: '/lmp/v2/admin/blocked_phone/import',
    method: 'post',
    data
  })
}

export function setting(data) {
  return request({
    url: '/lmp/v2/admin/blocked_phone/setting',
    method: 'put',
    data
  })
}

export function get_setting(params) {
  return request({
    url: '/lmp/v2/admin/blocked_phone/setting',
    method: 'get',
    params
  })
}

export default { add, upload, setting, get_setting }
