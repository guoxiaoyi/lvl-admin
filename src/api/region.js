import request from '@/utils/request'
import qs from 'qs'

export function getChildren(data) {
  return request({
    url: '/api/region/getChildren',
    method: 'post',
    data
  })
}
export function tree() {
  return request({
    url: '/api/region',
  })
}

export function names(data){
  return request({
    url: '/api/region/names',
    method: 'post',
    data
  })
}

export default { tree, getChildren, names }
