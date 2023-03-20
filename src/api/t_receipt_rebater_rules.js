import request from '@/utils/request'

export function add(data) {
  return request({
    url: `/lmp/admin/api/t_receipt_rebater_rules`,
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/admin/api/t_receipt_rebater_rules/${data.id}`,
    method: 'put',
    data
  })
}

export function show(params) {
  return request({
    url: `/lmp/admin/api/t_receipt_rebater_rules/${params.id}`,
    method: 'get',
    params
  })
}
export function del(data) {
  return request({
    url: `/lmp/admin/api/t_receipt_rebater_rules/${data.id}`,
    method: 'delete',
    data
  })
}

export default { add, edit, show, del }
