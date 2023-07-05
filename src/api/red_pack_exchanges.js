import request from '@/utils/request'

export function download(data) {
  return request({
    url: '/lmp/v2/admin/red_pack_exchange/download',
    method: 'post',
    data
  })
}

export default { download }
