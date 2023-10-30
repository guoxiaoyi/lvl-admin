import request from '@/utils/request'

export function index(params) {
  return request({
    url: '/lmp/v2/admin/custom_form',
    method: 'get',
    params
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/custom_form/${data.id}`,
    method: 'put',
    data
  })
}

export function t_unit_batch(params) {
  return request({
    url: '/lmp/admin/api/t_unit_batch/custom_fields',
    method: 'get',
    params
  })
}

export function product(params) {
  const p = { ...params, type: 'CustomForms::Product' }
  return request({
    url: '/lmp/v2/admin/custom_form',
    method: 'get',
    params: p
  })
}
export function product_order(data) {
  return request({
    url: `/lmp/admin/api/product/custom_form/${data.id}`,
    method: 'put',
    data
  })
}

export default { index, edit, t_unit_batch, product, product_order }
