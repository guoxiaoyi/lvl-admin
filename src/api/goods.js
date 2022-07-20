import request from '@/utils/request'

export function postGoods(data) {
  return request({
    url: '/api/goods',
    method: 'post',
    data
  })
}
