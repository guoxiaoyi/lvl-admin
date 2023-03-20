import request from '@/utils/request'

export function postGoods(data) {
  return request({
    url: '/lmp/admin/api/goods',
    method: 'post',
    data
  })
}

export function rebater_goods(params) {
  return request({
    url: '/lmp/admin/api/goods/rebater',
    method: 'get',
    params
  })
}
