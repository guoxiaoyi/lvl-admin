import request from '@/utils/request'

export function unit_unzip_pwd(data) {
  return request({
    url: `/lmp/v2/admin/store/unit_unzip_pwd`,
    method: 'put',
    data
  })
}
export function unit_preview_pwd(data) {
  return request({
    url: `/lmp/v2/admin/store/unit_preview_pwd`,
    method: 'put',
    data
  })
}

export function show() {
  return request({
    url: `/lmp/v2/admin/store/security_setting`,
    method: 'get'
  })
}

export default { unit_unzip_pwd, unit_preview_pwd, show }
