import page_config from '../Page.js'
class MoneyPage extends Object {
  constructor() {
    super()
    this.default = { ...page_config.defaultParams(this.constructor.name), child_good_enabled: true }
  }
  // 其他属性和方法
}
const params = new MoneyPage()
export default { ...params.default }
