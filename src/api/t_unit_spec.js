import request from '@/utils/request'
export function index(params) {
  return request({
    url: '/lmp/v2/admin/t_unit_spec',
    method: 'get',
    params
  })
}

export function levels_data(params) {
  return request({
    url: `/lmp/v2/admin/t_unit_spec/${params.id}/levels_data`,
    method: 'get'
  })
}

export default { index, levels_data }
