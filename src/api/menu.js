import request from '@/utils/request'

export function menus() {
  return request({
    url: '/auth/menus',
    method: 'get'
  })
}
