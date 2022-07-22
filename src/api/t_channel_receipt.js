import request from '@/utils/request'
import qs from 'qs'

export function index() {
  return request({
    url: '/lmp/admin/api/t_channel_receipt',
    method: 'get'
  })
}

export default { index }
