const Mock = require('mockjs')
const data = Mock.mock({
  'content|25': [{
    id: '@increment(setp)',
    amount: '@integer(0, 1000)',
    createdAt: '@date',
    nameText: '@word',
    balance: '@integer(0, 1000)',
    note: '@cparagraph(0,1)'
  }],
  totalPages: 10,
  totalElements: 250
})
const types = Mock.mock({
  'data|10': [{
    code: '@word',
    desc: '@word'
  }]
})

module.exports = [
  {
    url: /\/lmp\/v2\/admin\/user\/\d+\/user_cash_tran/,
    response: config => {
      console.log(config)
      return {
        code: 0,
        data: {
          ...data
        }
      }
    }
  },
  {
    url: `/lmp/v2/admin/user/user_cash_tran/name_dict`,
    response: config => {
      return {
        code: 0,
        data: types.data
      }
    }
  }
]
