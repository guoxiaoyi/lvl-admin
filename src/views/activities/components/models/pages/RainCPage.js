import page_config from '../Page.js'
class RainCPage extends Object {
  constructor() {
    super()
    this.default = { ...page_config.defaultParams(this.constructor.name) }
  }
  // 其他属性和方法
}
const params = new RainCPage()
export default { ...params.default }
