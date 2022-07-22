import request from '@/utils/request'
export function getGoods(params) {
  return request({
    url: '/lmp/admin/api/goods',
    method: 'get',
    params
  })
}
export function show(params) {
  return request({
    url: `/lmp/admin/api/goods/info/${params.id}`,
    method: 'get',
  })
}

export default {show }
