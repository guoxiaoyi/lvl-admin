import request from '@/utils/request'
import qs from 'qs'

export function permissions() {
  return request({
    url: '/lmp/admin/api/store/permissions',
    method: 'get'
  })
}

export default { permissions }
