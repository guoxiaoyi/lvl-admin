import request from '@/utils/request'
import qs from 'qs'

export function getChildren(data) {
  return request({
    url: '/lmp/admin/api/region/getChildren',
    method: 'post',
    data
  })
}
export function tree() {
  return request({
    url: '/lmp/admin/api/region',
  })
}

export function names(data){
  return request({
    url: '/lmp/admin/api/region/names',
    method: 'post',
    data
  })
}

export default { tree, getChildren, names }
