import page_config from '../Page.js'
class RedPack3Page extends Object {
  constructor() {
    super()
    this.default = { ...page_config.defaultParams(this.constructor.name) }
  }
  // 其他属性和方法
}
const params = new RedPack3Page()
export default { ...params.default }
