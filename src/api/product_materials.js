import request from '@/utils/request'

export function add(data) {
  return request({
    url: `/lmp/v2/admin/product/${data.productId}/product_material`,
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/product/${data.productId}/product_material/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/product/${data.origin.productId}/product_material/${data.id}`,
    method: 'delete'
  })
}

export default { add, edit, del }
