export default {
  name: {
    kind: 'string',
    label: '产品名称',
    required: true
  },
  images: {
    kind: 'string',
    label: '图片'
  },
  price: {
    kind: 'string',
    label: '价格'
  },
  code: {
    kind: 'string',
    label: '产品代码'
  },
  description: {
    kind: 'string',
    label: '描述'
  },
  spec: {
    kind: 'string',
    label: '规格'
  },
  ean_13: {
    kind: 'string',
    label: '商品条码'
  },
  url: {
    kind: 'string',
    label: '产品链接',
    hint: `为产品的展示或者购买页面，如果没有可不填（链接格式如:'http://www.lifanli.cn'）`
  },
  firm: {
    kind: 'string',
    label: '生产商'
  },
  address: {
    kind: 'string',
    label: '地址'
  },
  origin: {
    kind: 'string',
    label: '产地'
  },
  phone: {
    kind: 'string',
    label: '电话'
  }
}
