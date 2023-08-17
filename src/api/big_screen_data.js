import request from '@/utils/request'
export function get() {
  return request({
    url: '/lmp/v2/admin/data_screen_setting',
    method: 'get'
  })
}
export function edit(data) {
  return request({
    url: '/lmp/v2/admin/data_screen_setting',
    method: 'put',
    data
  })
}

export default { get, edit }
