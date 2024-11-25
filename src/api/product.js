import request from '@/utils/request'

export function all(params) {
  return new Promise((resolve, reject) => {
    request({
      url: '/lmp/v2/admin/product',
      method: 'get',
      params: {
        size: 1000,
        ...params
      }
    }).then(({ data }) => {
      resolve({ data: data.content })
    }).catch(fail => {
      reject(fail)
    })
  })
}

export function index() {
  return request({
    url: '/lmp/v2/admin/product',
    method: 'get'
  })
}

export function show(id) {
  return request({
    url: `/lmp/v2/admin/product/${id}`,
    method: 'get'
  })
}

export function t_unit_specs(params) {
  return request({
    url: `/lmp/admin/api/t_unit_spec/all`,
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/product`,
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/lmp/v2/admin/product/${data.id}`,
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/v2/admin/product/${data.id}`,
    method: 'delete',
    data
  })
}

export function copy(data) {
  return request({
    url: `/lmp/v2/admin/product/${data.id}/copy`,
    method: 'post',
    data
  })
}

export function uploadFile(data) {
  return request({
    url: `/lmp/v2/admin/import_product`,
    method: 'post',
    data
  })
}

export function download(params) {
  return request({
    url: `/lmp/v2/admin/product/import/${params.id}/download`,
    method: 'get'
  })
}

export function template(params) {
  return request({
    url: `/lmp/admin/api/product/template`,
    method: 'get',
    params
  })
}
export function batch_list(params) {
  return request({
    url: `/lmp/v2/admin/product_batch/${params.productId}/list`,
    method: 'get',
    params
  })
}

export function product_label_setting(params) {
  return request({
    url: `/lmp/v2/admin/product/${params.id}/product_label_setting`
  })
}
export function edit_product_label_setting(data) {
  return request({
    url: `/lmp/v2/admin/product/${data.id}/product_label_setting`,
    method: 'put',
    data
  })
}

export default { all, index, show, t_unit_specs, add, edit, del, copy, uploadFile, download, template, batch_list, product_label_setting, edit_product_label_setting }
