const Mock = require('mockjs')

const data = Mock.mock({
  'items|25': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

module.exports = [
  {
    url: '/lmp/admin/api/products',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 0,
        data: {
          totalElements: 40,
          content: items
        }
      }
    }
  }
]
