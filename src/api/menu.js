import request from '@/utils/request'

export function menus() {
  return request({
    url: '/lmp/v2/admin/auth/current_account_sidebars_menus',
    method: 'get'
  })
}
