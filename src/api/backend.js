import request from '@/utils/request'

export function show(params) {
  return request({
    url: `/lmp/v2/admin/backend_jobs/${params.id}`,
    method: 'get'
  })
}

export function download(params) {
  return request({
    url: `/lmp/v2/admin/backend_jobs/${params.id}/download`,
    method: 'get'
  })
}

export function list(params) {
  return request({
    url: `/lmp/v2/admin/backend_jobs`,
    method: 'get',
    params
  })
}

export default { show, download, list }
