import request from '@/utils/request'

export function menus() {
  return request({
    url: '/admin/accounts/menus.json',
    method: 'get'
  })
}
