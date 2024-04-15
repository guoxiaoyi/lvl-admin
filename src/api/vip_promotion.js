import request from '@/utils/request'
import qs from 'qs'
export function state(params) {
  return request({
    url: '/lmp/v2/admin/stats/user/promotion?' + qs.stringify(params, { indices: false }),
  })
}
export function source_type(params) {
  return request({
    url: '/lmp/v2/admin/stats/user/promotion/source_type?' + qs.stringify(params, { indices: false }),
  })
}

export default { state, source_type }
