import request from '@/utils/request'
import qs from 'qs'

export function edit(data) {
  return request({
    url: `/api/register_setting`,
    method: 'put',
    data
  })
}
export function show() {
  return request({
    url: `/api/register_setting`,
    method: 'get'
  })
}

export default { edit, show }
