import request from '@/utils/request'

export function getGift(params) {
  params = {onSale: true, ...params}
  return request({
    url: '/api/gift',
    method: 'get',
    params
  })
}

export function getGiftProvider(params) {
  return request({
    url: '/api/gift/provider',
    method: 'get',
    params
  })
}

export function getGiftType(params) {
  return request({
    url: '/api/gift/category',
    method: 'get',
    params
  })
}

export function postGift(data) {
  return request({
    url: '/api/gift',
    method: 'post',
    data
  })
}

export function getGiftInfo(params) {
  return request({
    url: `/api/gift/info/${params.id}`,
    method: 'get',
  })
}
