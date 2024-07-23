import request from '@/utils/request'

export function info(params) {
  return request({
    url: '/lmp/v2/admin/cultivate_activity_store_setting/info',
    params
  })
}
export function update(data) {
  return request({
    url: '/lmp/v2/admin/cultivate_activity_store_setting',
    method: 'PUT',
    data
  })
}
export default { info, update }
