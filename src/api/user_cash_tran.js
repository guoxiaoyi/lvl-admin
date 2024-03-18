import request from '@/utils/request'
export function types() {
  return request({
    url: '/lmp/v2/admin/user/user_cash_tran/name_dict'
  })
}

export default { types }
