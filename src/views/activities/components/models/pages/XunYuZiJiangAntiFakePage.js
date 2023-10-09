import page_config from '../Page.js'
class XunYuZiJiangAntiFakePage extends Object {
  constructor() {
    super()
    const product_required = true
    this.default = { ...page_config.defaultParams(this.constructor.name), product_required }
  }
  // 其他属性和方法
}
const params = new XunYuZiJiangAntiFakePage()
export default { ...params.default }
