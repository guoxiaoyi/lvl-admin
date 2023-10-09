import page_config from '../Page.js'
class ProductRedPack2Page extends Object {
  constructor() {
    super()
    const product_required = true
    this.default = { ...page_config.defaultParams(this.constructor.name), product_required }
  }
  // 其他属性和方法
}
const params = new ProductRedPack2Page()
export default { ...params.default }
