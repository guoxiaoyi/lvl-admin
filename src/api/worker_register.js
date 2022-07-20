import request from '@/utils/request'
import qs from 'qs'

export function show(params) {
  return request({
    url: `/api/register/${params.id}`,
    method: 'get'
  })
}
export function audit(data) {
  return request({
    url: `/api/register/${data.id}/audit`,
    method: 'put',
    data
  })
}

export default { show, audit }
