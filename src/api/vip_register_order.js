import request from '@/utils/request'
import qs from 'qs'
export function index(params) {
  return request({
    url: '/lmp/v2/admin/vip_register_order' + qs.stringify(params, { indices: false })
  })
}

export function get(params) {
  return request({
    url: `/lmp/v2/admin/vip_register_order/${params.code}`
  })
}

export function submit(data) {
  return request({
    url: `/lmp/v2/admin/vip_register_order/${data.code}/submit`,
    method: 'put'
  })
}

export default { index, get, submit }
