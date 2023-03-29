import request from '@/utils/request'
import qs from 'qs'

export function tmp(data) {
  return request({
    url: '/lmp/admin/api/amazon/upload/tmp',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}

export default { tmp }
