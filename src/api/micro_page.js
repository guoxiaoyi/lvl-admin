import request from '@/utils/request'
import micro_page from '@/utils/micro_page'
export function index() {
  return request({
    url: '/lmp/v2/admin/micro_page',
    method: 'get'
  })
}
export function show(params) {
  return request({
    url: `/lmp/v2/admin/micro_page/${params.id}`,
    method: 'get'
  })
}
export function edit(data) {
  return request({
    url: `/lmp/v2/admin/micro_page/${data.id}`,
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: `/lmp/v2/admin/micro_page`,
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: `/lmp/v2/admin/micro_page/${data.id}`,
    method: 'delete',
    data
  })
}

export function templates() {
  return new Promise((resolve, reject) => {
    resolve({ code: 0, data: micro_page.templates(`https://admin.${process.env.VUE_APP_BASE_DOMAIN}/lmp/portal/admin`) })
  })
}

export function downloadForm(data) {
  return request({
    url: `/lmp/v2/mobile/micro_page/${data.id}/forms/download`,
    method: 'post',
    data
  })
}

export default { index, show, edit, add, del, templates, downloadForm }
