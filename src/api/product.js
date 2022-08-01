import request from '@/utils/request'
import qs from 'qs'

export function all() {
  return request({
    url: '/lmp/admin/api/product/all',
    method: 'get'
  })
}

export default { all }
