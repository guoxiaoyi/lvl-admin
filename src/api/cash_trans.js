import request from '@/utils/request'

export function allocatable_sn_ranges(params) {
  return request({
    url: `/lmp/v2/admin/store/allocatable_sn_ranges`,
    method: 'get'
  })
}

export function download(params) {
  return request({
    url: `/lmp/v2/admin/cash_trans/export`,
    method: 'get'
  })
}

export default { allocatable_sn_ranges, download }
