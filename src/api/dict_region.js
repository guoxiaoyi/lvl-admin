import request from '@/utils/request'
export function tree(params) {
  return request({
    url: '/lmp/v2/admin/dict_region/tree',
    method: 'get',
    params
  })
}
export default { tree }
