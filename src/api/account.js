import request from '@/utils/request'
import qs from 'qs'

export function permissions() {
  return request({
    url: '/api/store/permissions',
    method: 'get'
  })
}

export default { permissions }
