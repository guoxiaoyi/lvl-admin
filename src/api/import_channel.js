import request from '@/utils/request'
import qs from 'qs'

export function download(params) {
  return request({
    url: `/lmp/admin/api/import_channel/${params.id}/download`,
    method: 'get'
  })
}
export function template() {
  return request({
    url: `/lmp/admin/api/import_channel/template`,
    method: 'get',
    responseType: 'blob'
  })
}
export function importchannel(data) {
  return request({
    url: `/lmp/admin/api/import_channel/importchannel`,
    method: 'post',
    data
  })
}

export default { download, template, importchannel }
