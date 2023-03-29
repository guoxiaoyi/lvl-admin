import request from '@/utils/request'

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

export default { index, show }
