import request from '@/utils/request'
export function all(params) {
  return request({
    url: '/api/tag/all',
    method: 'get',
    params
  })
}


export default { all }
