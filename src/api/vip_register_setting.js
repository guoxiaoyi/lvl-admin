import request from '@/utils/request'
export function list(params) {
  return request({
    url: '/lmp/v2/admin/vip_register_setting/list',
    method: 'get',
    params
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/vip_register_setting/${data.id}`,
    method: 'put',
    data
  })
}

export function add(data) {
  return request({
    url: `/lmp/v2/admin/vip_register_setting`,
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/vip_register_setting/${data.id}`,
    method: 'delete',
    data
  })
}

export default { list, edit, add, del }
