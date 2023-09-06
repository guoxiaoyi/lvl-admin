import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: `/lmp/v2/admin/t_unit_relation_import`,
    method: 'post',
    data
  })
}

export function download(params) {
  return request({
    url: `/lmp/v2/admin/t_unit_relation_import/${params.id}/file`,
    method: 'get'
  })
}

export default { uploadFile, download }
