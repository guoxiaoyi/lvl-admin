import request from '@/utils/request'
export function edit(data) {
  return request({
    url: '/lmp/v2/admin/wechat_message_template/enable',
    method: 'put',
    data
  })
}

export default { edit }
