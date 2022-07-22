import request from '@/utils/request'
import qs from 'qs'

export function get(params) {
  return request({
    url: `/lmp/admin/api/employee/${params.id}`,
    method: 'get',
  })
}
export function edit(data) {
  return request({
    url: `/lmp/admin/api/employee/${data.id}`,
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: `/lmp/admin/api/employee/${data.id}`,
    method: 'delete',
    data
  })
}

export function setManager(params) {
  return request({
    url: `/lmp/admin/api/employee/${params.id}/setManager`,
    method: 'get'
  })
}


export default { get, edit, del, setManager }
