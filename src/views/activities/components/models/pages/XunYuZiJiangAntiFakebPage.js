import page_config from '../Page.js'
class XunYuZiJiangAntiFakebPage extends Object {
  constructor() {
    super()
    const product_required = true
    this.default = { ...page_config.defaultParams(this.constructor.name), product_required }
  }
  // 其他属性和方法
}
const params = new XunYuZiJiangAntiFakebPage()
export default { ...params.default }
