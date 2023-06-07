import request from '@/utils/request'

export function show(params) {
  return request({
    url: `/lmp/admin/api/backend_job/${params.id}`,
    method: 'get'
  })
}
export function download(params) {
  return request({
    url: `/lmp/admin/api/backend_job/${params.id}/download`,
    method: 'get'
  })
}

export default { show, download }
