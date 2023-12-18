import request from '@/utils/request'
export function api(params) {
  return request({
    url: `/lmp/v2/admin/api_file`,
    method: 'get'
  })
}

export default { api }
