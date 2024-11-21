import request from '@/utils/request'

export function get(params) {
  return request({
    url: `/lmp/v2/admin/operation_log/${params.idCode}/parameters`
  })
}

export default { get }
