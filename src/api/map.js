import request from '@/utils/request'

export function address_lat_lon(params) {
  return request({
    url: `/lmp/v2/admin/map/address_lat_lon`,
    method: 'get',
    params
  })
}

export default { address_lat_lon }
