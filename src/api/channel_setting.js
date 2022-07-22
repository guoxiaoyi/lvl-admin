import request from '@/utils/request'
import qs from 'qs'

export function edit(data) {
  return request({
    url: `/lmp/admin/api/channel_label_setting`,
    method: 'put',
    data
  })
}

export default { edit }
