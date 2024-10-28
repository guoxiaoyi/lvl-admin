import request from '@/utils/request'

export function delivering_failed(data) {
  return request({
    url: '/lmp/v2/admin/invite_vip_register_order/delivering_failed',
    method: 'post',
    data
  })
}

export default { delivering_failed }
