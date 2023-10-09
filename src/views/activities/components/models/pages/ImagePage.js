import page_config from '../Page.js'
class ImagePage extends Object {
  constructor() {
    super()
    this.default = { ...page_config.defaultParams(this.constructor.name) }
  }
  // 其他属性和方法
}
const params = new ImagePage()
export default { ...params.default }
