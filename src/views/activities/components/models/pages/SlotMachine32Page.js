import page_config from '../Page.js'
class SlotMachine32Page extends Object {
  constructor() {
    super()
    this.default = { ...page_config.defaultParams(this.constructor.name), child_good_enabled: true }
  }
  // 其他属性和方法
}
const params = new SlotMachine32Page()
export default { ...params.default }
