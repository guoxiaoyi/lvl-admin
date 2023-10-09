import page_config from '../Page.js'
class PointPage extends Object {
  constructor() {
    super()
    this.default = { ...page_config.defaultParams(this.constructor.name) }
  }
  // 其他属性和方法
}
const params = new PointPage()
export default { ...params.default }
