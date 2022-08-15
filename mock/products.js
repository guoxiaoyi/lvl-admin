const Mock = require('mockjs')

const data = Mock.mock({
  'items|19': [{
    address: '',
    batch: '',
    code: '',
    createdAt: '',
    deletedAt: '',
    description: '',
    ean13: '',
    firm: '',
    id: 0,
    imageList: [
      {
        assetableId: 0,
        assetableType: '',
        attachmentContentType: '',
        attachmentFileName: '',
        attachmentFileSize: 0,
        attachmentUpdatedAt: '',
        createdAt: '',
        deleteTime: '',
        deleted: true,
        height: 0,
        id: 0,
        imgName: '',
        type: '',
        updatedAt: '',
        url: '',
        width: 0
      }
    ],
    name: '',
    origin: '',
    phone: '',
    price: 0,
    spec: '',
    storeId: 0,
    unitSpec: [
      {
        id: 0,
        unitSpecName: ''
      }
    ],
    updatedAt: '',
    url: ''
  }]
})
// id: '@id',
// title: '@sentence(10, 20)',
// 'status|1': ['published', 'draft', 'deleted'],
// author: 'name',
// display_time: '@datetime',
// pageviews: '@integer(300, 5000)'
module.exports = [
  {
    url: '/lmp/admin/api/products',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 0,
        data: {
          totalElements: 19,
          content: items
        }
      }
    }
  }
]
