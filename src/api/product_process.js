import request from '@/utils/request'

export function add(data) {
  return request({
    url: `/lmp/v2/admin/product/${data.productId}/product_process`,
    method: 'post',
    data
  })
}

export function edit(data) {
  console.log(data)
  return request({
    url: `/lmp/v2/admin/product/${data.productId}/product_process/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/product/${data.origin.productId}/product_process/${data.id}`,
    method: 'delete'
  })
}
export function updatePosition(data) {
  console.log(data)
  return request({
    url: `/lmp/v2/admin/product/${data.productId}/product_process/${data.id}/position`,
    method: 'put',
    data
  })
}

export default { add, edit, del, updatePosition }
