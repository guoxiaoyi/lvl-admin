import page_config from '../Page.js'
class PasswordPage extends Object {
  constructor() {
    super()
    this.default = { ...page_config.defaultParams(this.constructor.name) }
  }
  // 其他属性和方法
}
const params = new PasswordPage()
export default { ...params.default }
