import page_config from '../Page.js'
class RedPack2Page extends Object {
  constructor() {
    super()
    this.default = { ...page_config.defaultParams(this.constructor.name) }
  }
  // 其他属性和方法
}
const params = new RedPack2Page()
export default { ...params.default }
