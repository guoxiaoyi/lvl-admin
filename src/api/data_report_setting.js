import request from '@/utils/request'

export function get(params) {
  return request({
    url: `/lmp/v2/admin/store/data_report_setting`
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/store/data_report_setting`,
    method: 'put',
    data
  })
}

export function toggle_data_report_enabled(data) {
  return request({
    url: `/lmp/v2/admin/account/${data.accountId}/toggle_data_report_enabled`,
    method: 'put'
  })
}

export default { get, edit, toggle_data_report_enabled }
