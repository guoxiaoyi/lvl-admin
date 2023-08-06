import request from '@/utils/request'
export function add(data) {
  return request({
    url: '/lmp/v2/admin/units_exports',
    method: 'post',
    data
  })
}
export function unitsExport(data) {
  return request({
    url: '/lmp/v2/admin/units_exports/new',
    method: 'post',
    data
  })
}
export function all_sn_ranges(params) {
  return request({
    url: '/lmp/v2/admin/store/all_sn_ranges',
    method: 'get',
    params
  })
}

export function img_generating(params) {
  return request({
    url: `/lmp/v2/admin/units_exports/${params.id}/img_generating`,
    method: 'get',
    params
  })
}
export function download(url, params) {
  return request({
    url: `/lmp/v2/admin/units_exports/${params.id}/${url}`,
    method: 'get',
    params
  })
}

export function reexport(data) {
  return request({
    url: `/lmp/v2/admin/units_exports/${data.id}/reexport`,
    method: 'post'
  })
}

export default { add, unitsExport, all_sn_ranges, img_generating, download, reexport }
