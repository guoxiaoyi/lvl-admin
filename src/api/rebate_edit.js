import request from '@/utils/request'
export function show(params) {
  return request({
    url: '/lmp/v2/admin/store/rebate_setting',
    method: 'get',
    params
  })
}

export function edit(data) {
  return request({
    url: '/lmp/v2/admin/store/rebate_setting',
    method: 'put',
    data
  })
}

export default { show, edit }
