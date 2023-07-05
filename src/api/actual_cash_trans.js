import request from '@/utils/request'

export function download(data) {
  return request({
    url: '/lmp/v2/admin/actual_cash_trans/download',
    method: 'post',
    data
  })
}

export default { download }
