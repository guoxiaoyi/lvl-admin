import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/lmp/v2/admin/import_external_user',
    method: 'post',
    data: data.file
  })
}

export default { add }
