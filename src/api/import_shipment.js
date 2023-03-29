import request from '@/utils/request'

export function download(params) {
  return request({
    url: `/lmp/v2/admin/import_shipment/${params.id}/download`,
    method: 'get',
    params
  })
}
export function template() {
  return request({
    url: `/lmp/v2/admin/import_shipment/template`,
    method: 'get',
    responseType: 'blob'
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/import_shipment`,
    method: 'post',
    data
  })
}

export default { download, template, add }
