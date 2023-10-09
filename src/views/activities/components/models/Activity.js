import Main from './activities/Main'
import UnitsActivity from './activities/UnitsActivity'
import AntiFakeActivity from './activities/AntiFakeActivity'
import InvitingActivity from './activities/InvitingActivity'
import SharingActivity from './activities/SharingActivity'

class Activity {
  static TypeMap = {
    Activity: Main,
    UnitsActivity: UnitsActivity,
    AntiFakeActivity: AntiFakeActivity,
    InvitingActivity: InvitingActivity,
    SharingActivity: SharingActivity
  }
  constructor(options) {
    this.pageType = options.page_type
    this.kind = options.kind
    this.type = options.type
    this.t_unit = this.kind === 't_unit'
    this.normal = this.kind === 'normal'
    try {
      const module = require(`./pages/${this.pageType}.js`)
      this.product_required = module.default.product_required
      this.page = module.default
    } catch (error) {
      console.error(`文件不存在或无法加载:${this.pageType}.js`, error)
      const module = require(`./Page.js`)
      this.product_required = module.default.product_required
      this.page = module.default
    }

    this.sharing_required = Activity.TypeMap[this.type].sharing_required
  }

  is_a(type) {
    return Activity.TypeMap[this.type].inheritance.includes(type)
  }

  instance_of(type) {
    return type === Activity.TypeMap[this.type].type
  }
}

export default Activity
