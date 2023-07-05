import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/lmp/v2/admin/cash_deal/offline',
    method: 'post',
    data
  })
}

export default { add }
