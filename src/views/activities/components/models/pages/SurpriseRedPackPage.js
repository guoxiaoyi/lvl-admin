import page_config from '../Page.js'
class SurpriseRedPackPage extends Object {
  constructor() {
    super()
    this.default = { ...page_config.defaultParams(this.constructor.name) }
  }
  // 其他属性和方法
  // ...page_config
}
const params = new SurpriseRedPackPage()
export default { ...params.default }
