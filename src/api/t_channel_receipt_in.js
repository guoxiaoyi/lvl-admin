import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/lmp/admin/api/t_channel_receipt/in',
    method: 'post',
    data
  })
}

export function product_in(data) {
  return request({
    url: '/lmp/admin/api/t_channel_receipt/product_in',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/admin/api/t_channel_receipt/${data.id}`,
    method: 'put',
    data
  })
}

export default { add, edit, product_in }
