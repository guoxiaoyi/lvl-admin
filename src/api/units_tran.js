import request from '@/utils/request'

export function download(data) {
  return request({
    url: '/lmp/v2/admin/units_tran/download',
    method: 'post',
    data
  })
}

export default { download }
