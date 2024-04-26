import request from '@/utils/request'
export function setting() {
  return request({
    url: `/lmp/v2/admin/checkin_activity/setting`
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/checkin_activity/setting`,
    method: 'POST',
    data
  })
}

export default { setting, edit }
