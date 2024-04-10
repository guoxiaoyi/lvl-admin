const Mock = require('mockjs')
const data = Mock.mock({
  'content|25': [{
    id: '@id',
    storeId: '@id',
    label: '@name(1, 20)',
    'sourceType|1': ['unit_activity', 'sms', 'wechat', 'offline_store', 'wework', 'online_channel'],
    'sourceTypeName|1': ['unit_activity', 'sms', 'wechat', 'offline_store', 'wework', 'online_channel'],
    relatedContent: '@sentence(10, 20)',
    'state|1': ['enabled', 'closed'],
    stateName: '@sentence(10, 20)',
    createdAt: '@datetime',
    updatedAt: '@datetime',
    'deletedAt|1': ['@datetime', null],
    relatedObject: {}
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
    url: '/acquisition_promotion/3',
    response: config => {
      return {
        code: 0,
        data: {
          ...data
        }
      }
    }
  }
]
