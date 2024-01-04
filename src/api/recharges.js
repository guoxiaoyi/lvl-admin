import request from '@/utils/request'

export function download(data) {
  return request({
    url: '/lmp/v2/admin/cash_deal/recharge_export',
    method: 'post',
    data
  })
}

export default { download }
