import request from '@/utils/request'
import qs from 'qs'

export function show(params) {
  return request({
    url: `/lmp/admin/api/t_channel_product/${params.id}`,
    method: 'get'
  })
}

export default { show }
