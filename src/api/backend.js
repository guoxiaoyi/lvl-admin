import request from '@/utils/request'
import qs from 'qs'

export function show(params) {
  return request({
    url: `/api/backend_job/${params.id}`,
    method: 'get'
  })
}
export function download(params) {
  return request({
    url: `/api/backend_job/${params.id}/download`,
    method: 'get'
  })
}

export default { show, download }
