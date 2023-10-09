import page_config from '../Page.js'
class AwardPage extends Object {
  constructor() {
    super()
    this.default = { ...page_config.defaultParams(this.constructor.name) }
  }
  // 其他属性和方法
}
const params = new AwardPage()
export default { ...params.default }
