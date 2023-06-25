import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/lmp/v2/admin/whitelist_phone',
    method: 'post',
    data
  })
}
export function upload(data) {
  return request({
    url: '/lmp/v2/admin/whitelist_phone/import',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/lmp/v2/admin/whitelist_phone',
    method: 'delete',
    data
  })
}

export function del_all(data) {
  return request({
    url: '/lmp/v2/admin/whitelist_phone/delete_all',
    method: 'delete',
    data
  })
}

export default { add, upload, del, del_all }
