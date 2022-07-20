import request from '@/utils/request'
import qs from 'qs'

export function index(params) {
  return request({
    url: '/api/custom_form',
    method: 'get',
    params
  })
}

export function edit(data) {
  return request({
    url: `/api/custom_form/${data.id}`,
    method: 'put',
    data
  })
}


export default { index, edit }
