import request from '@/utils/request'

export function show(params) {
  return request({
    url: `/lmp/v2/admin/bank_card`,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/bank_card`,
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/bank_card`,
    method: 'post',
    data
  })
}

export function withdraw_procedure_fee(params) {
  return request({
    url: `/lmp/v2/admin/cash_deal/withdraw_procedure_fee`,
    method: 'get',
    params
  })
}


export default { show, edit, add, withdraw_procedure_fee }
