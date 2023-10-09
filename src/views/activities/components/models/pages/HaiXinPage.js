import page_config from '../Page.js'
class HaiXinPage extends Object {
  constructor() {
    super()
    this.default = { ...page_config.defaultParams(this.constructor.name) }
  }
  // 其他属性和方法
}
const params = new HaiXinPage()
export default { ...params.default }
