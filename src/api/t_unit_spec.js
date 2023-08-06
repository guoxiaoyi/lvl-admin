import request from '@/utils/request'
export function index(params) {
  return request({
    url: '/lmp/v2/admin/t_unit_spec',
    method: 'get',
    params
  })
}
export default { index }
