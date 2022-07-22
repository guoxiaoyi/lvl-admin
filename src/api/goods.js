import request from '@/utils/request'

export function postGoods(data) {
  return request({
    url: '/lmp/admin/api/goods',
    method: 'post',
    data
  })
}
