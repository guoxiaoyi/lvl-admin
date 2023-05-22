import request from '@/utils/request'

export function get(params) {
  return request({
    url: `/lmp/v2/admin/vip_setting/vip_interest/${params.id}`,
    method: 'get'
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/vip_setting/vip_interest/${data.id}`,
    method: 'delete',
    data
  })
}

export function add(data) {
  return request({
    url: `/lmp/v2/admin/vip_setting/vip_interest`,
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/vip_setting/vip_interest/${data.id}`,
    method: 'put',
    data
  })
}

export default { get, del, add, edit }
