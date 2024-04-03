import request from '@/utils/request'
import qs from 'qs'
export function overview(params) {
  return request({
    url: '/lmp/v2/admin/stats/vip/overview',
    method: 'get',
    params
  })
}
export function trend(params) {
  return request({
    url: '/lmp/v2/admin/stats/vip/trend' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
export function level_change(params) {
  return request({
    url: '/lmp/v2/admin/stats/vip/level_change' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { overview, trend, level_change }
