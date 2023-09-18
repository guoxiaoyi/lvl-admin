import request from '@/utils/request'

export function allocatable_sn_ranges(params) {
  return request({
    url: `/lmp/v2/admin/store/allocatable_sn_ranges`,
    method: 'get'
  })
}

export function download(data) {
  return request({
    url: `/lmp/v2/admin/cash_trans/download`,
    method: 'post',
    data
  })
}

export default { allocatable_sn_ranges, download }
