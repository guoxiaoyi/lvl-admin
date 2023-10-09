import request from '@/utils/request'
export function tree(params) {
  return request({
    url: '/lmp/v2/admin/dict_region/tree',
    method: 'get',
    params
  })
}
export function tree_duplicate(data) {
  return request({
    url: '/lmp/v2/admin/dict_region/tree_duplicate',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: JSON.stringify(data)
  })
}
export default { tree, tree_duplicate }
