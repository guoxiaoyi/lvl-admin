import page_config from '../Page.js'
class HongChuanPage extends Object {
  constructor() {
    super()
    const product_required = true
    this.default = { ...page_config.defaultParams, product_required }
  }
  // 其他属性和方法
}
const params = new HongChuanPage()
export default { ...params.default }
