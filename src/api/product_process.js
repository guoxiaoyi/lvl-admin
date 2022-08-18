import request from '@/utils/request'

export function add(data) {
  return request({
    url: `/lmp/admin/api/product/${data.id}/product_process`,
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/admin/api/product_process/${data.id}`,
    method: 'put',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/admin/api/product_process/${data.id}`,
    method: 'delete'
  })
}

export default { add, edit, del }
