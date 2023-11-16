<template>
  <div>
    <template v-if="form.state === 'pending'">
      <div v-if="form.kind === 'normal' && activity.type === 'UnitsActivity' && !form.parentId " class="alert alert-warning" role="alert">
        <i class="fa fa-alert-warning fa-lg" /> 创建一物一码活动生成二维码流程已调整，点击<a href="http://admin.lifanli.cn/admin/public_notices/237" target="blank">查看详情</a>
      </div>
      <Step :active="0" :activity="activity" />
    </template>
    <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
      <template v-if="$route.name !== 'ActivityEdit'">
        <h5>活动设置</h5>
        <hr>
      </template>
      <el-form-item ref="type" label="活动类型" prop="type">
        {{ activity.typeText }}
        <span v-if="form.kind === 't_unit'" class="label label-light">追溯码</span>
      </el-form-item>
      <el-form-item ref="pageType" label="互动类型" prop="pageType">
        {{ pageTypeName }}
      </el-form-item>
      <el-form-item label="活动标题" prop="title">
        <el-input v-model="form.title" :maxlength="16" />
        <p class="help-block">用户端活动记录可见。最多16个字符</p>
      </el-form-item>
      <!-- 如果不是子活动 -->
      <div v-if="!form.parentId">
        <el-form-item ref="startAt" prop="startAt" label="开始时间">
          <el-date-picker
            v-model="form.startAt"
            type="datetime"
            :default-time="defaultTime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
        <el-form-item ref="endAt" prop="endAt" label="结束时间">
          <el-date-picker
            v-model="form.endAt"
            type="datetime"
            :default-time="defaultTime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
        <el-form-item ref="cycleEnabled" label="智能启动">
          <el-switch v-model="form.cycleEnabled" />
          <p class="help-block">开启后，按照设置规则自动开启活动，规则外无法参与活动。</p>
          <div v-if="form.cycleEnabled" class="child-form">
            <el-form-item label="启动规则" prop="cycleType" :rules="{ required: true, message: '不能为空', trigger: 'blur'}">
              <el-radio-group v-model="form.cycleType">
                <el-radio label="every_day">每天</el-radio>
                <el-radio label="scheduled_date">每逢日期</el-radio>
                <el-radio label="every_week">每星期</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.cycleType === 'scheduled_date'" label=" " prop="scheduledDateValue">
              <el-input v-if="form.cycleType === 'scheduled_date'" v-model="form.scheduledDateValue" placeholder="8,18,28" />
            </el-form-item>
            <el-form-item v-if="form.cycleType === 'every_week'" label=" " prop="weekValue">
              <el-select v-model="form.weekValue" multiple>
                <el-option label="一" :value="1">一</el-option>
                <el-option label="二" :value="2">二</el-option>
                <el-option label="三" :value="3">三</el-option>
                <el-option label="四" :value="4">四</el-option>
                <el-option label="五" :value="5">五</el-option>
                <el-option label="六" :value="6">六</el-option>
                <el-option label="日" :value="7">日</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间段">
              <div class="el-custom-input-group">
                <el-form-item prop="startHour">
                  <el-input v-model="form.startHour" />
                </el-form-item>
                <div class="el-input-group-addon">至</div>
                <el-form-item prop="endHour">
                  <el-input v-model="form.endHour" />
                </el-form-item>
              </div>
            </el-form-item>
          </div>
        </el-form-item>
      </div>

      <el-form-item ref="attendRule" label="参与次数规则">
        <!-- attendRuleDays 自定义参与天数
        attendRuleTimes 自定义参与次数 -->
        <el-select v-model="form.attendRule">
          <el-option value="none" label="不限制参与次数" />
          <el-option value="once" label="1个用户最多参与1次" />
          <el-option value="once_a_day" label="1个用户1天最多参与1次" />
          <el-option value="custom" label="自定义参与频率" />
        </el-select>
        <div v-if="form.attendRule === 'custom'" class="el-custom-input-group" style="margin-top: 15px;">
          <div class="el-input-group-addon">1个用户</div>
          <el-form-item ref="attendRuleDays" prop="attendRuleDays">
            <el-input v-model="form.attendRuleDays" />
          </el-form-item>
          <div class="el-input-group-addon">天，最多参与</div>
          <el-form-item ref="attendRuleTimes" prop="attendRuleTimes">
            <el-input v-model="form.attendRuleTimes" />
          </el-form-item>
          <div class="el-input-group-addon">次</div>
        </div>
      </el-form-item>
      <el-form-item v-if="detail.paused" :label="$t('activities.paused_desc')">
        <el-input v-model="form.pausedDesc" type="textarea" :rows="3" placeholder="当前活动已暂停，请稍后再试。" />
        <p class="help-block">当暂停活动时，用户扫码页面显示的文字说明</p>
      </el-form-item>
      <template v-if="account.store.productEnabled">
        <el-form-item ref="productId" label="活动产品" prop="productId" :rules="{required: activity.page[var2LowerCase('product_required')], message: '不能为空', trigger: 'blur'}">
          <el-input v-model="product.name" :disabled="true" placeholder="请点击右侧按钮选择">
            <template slot="append"><el-button type="success" :disabled="form.id && detail[var2LowerCase('suite_award_enabled')]" @click="modal.product = true">选择</el-button></template>
          </el-input>
          <p class="help-block">添加参加活动的产品，每个活动只能选择一个，或<router-link :to="{ name: 'ProductNew' }" target="_blank">新建产品</router-link>。</p>
        </el-form-item>
        <div v-if="Object.keys(product).length" class="panel panel-default" style="margin-left: 16.66%; width: 60%">
          <product-list v-if="Object.keys(product).length" :data="[product]" :loading="false" :except="['ean13']">
            <template slot="action">
              <el-button type="text" @click="product = {}, form.productId = null">删除</el-button>
            </template>
          </product-list>
        </div>

        <el-form-item v-if="activity.kind === 't_unit'" label="成套奖品">
          <el-switch v-model="form.suiteAwardEnabled" :disabled="form.id" />
          <div class="help-block">
            开启后，可根据产品包装规格设置成套奖品。<br>
            例如：包装规格为1箱*6瓶，在其规格内可进行以瓶为单位，设置一个或多个奖项及数量，最多不超过6个中奖礼品，每箱都按照同等抽奖规则中奖。
          </div>
          <div v-if="form.suiteAwardEnabled" class="child-form">
            <el-form-item label="包装规格" prop="unitSpecId" :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change']}">
              <el-select v-model="form.unitSpecId" :disabled="form.id">
                <el-option v-for="(item, index) in unitSpecList" :key="'unit' + index" :label="item.unitSpecName" :value="item.id" />
              </el-select>
              <p class="help-block">请选择产品包装规格，根据所选规格一级码数量设置成套奖品。</p>
            </el-form-item>
          </div>
        </el-form-item>
      </template>
      <el-form-item ref="activityTagIds" label="活动标签">
        <el-select v-model="form.activityTagIds" multiple filterable clearable>
          <el-option v-for="item in activityTagList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <p class="help-block">给活动打标签后，方便按标签查询统计活动，可多选，或<a href="javascript:void(0)" @click="addTag('ActivityTag', 'activityTagIds')">新建活动标签</a>。</p>
      </el-form-item>
      <el-form-item v-if="account.store.advancedUserMgrFunc" ref="activityUserTagIds" label="预设用户标签">
        <el-select v-model="form.activityUserTagIds" multiple filterable clearable>
          <el-option v-for="item in userTagList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <p class="help-block">用户参与活动后，会给该用户打上相应的标签，或<a href="javascript:void(0)" @click="addTag('UserTag', 'activityUserTagIds')">新建用户标签</a>。</p>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.note" type="textarea" :rows="2" />
        <p class="help-block">用于内部备注，不在活动页面显示。</p>
      </el-form-item>

      <SharingSetting v-if="activity[var2LowerCase('sharing_required')]" :form="form" :activity="activity" />
      <InvitingSetting v-if="activity.type === 'InvitingActivity'" :form="form" :activity="activity" />
      <template v-if="activity.kind === 'normal' && activity.type === 'UnitsActivity' && account.store.multiTakeFuncEnabled && !form.parentId ">
        <h5>一码多扫设置</h5>
        <hr>
        <el-form-item label="一码多扫">
          <el-switch v-model="form.multiTakeEnabled" :disabled="form.state !== 'pending'" />
          <p class="help-block">开启后，可设置一个二维码最多几人扫码参与活动，最多5人。</p>
          <div v-if="form.multiTakeEnabled" class="child-form">
            <el-form-item label="扫码次数">
              <el-input v-model="form.takenCount" :disabled="form.state !== 'pending'" />
            </el-form-item>
          </div>
        </el-form-item>
      </template>
      <hr>
      <template v-if="form.state === 'pending'">
        <el-button :loading="loading" type="success" @click="submit">保存，并下一步</el-button>
        <el-button v-if="form.id" @click="enter">确认并创建活动</el-button>
      </template>
      <el-button v-else type="success" :loading="loading" @click="submit">保存</el-button>
      <product-modal :show.sync="modal.product">
        <template slot="action" slot-scope="row">
          <el-button type="text" @click="selectProduct(row.data)">选择</el-button>
        </template>
      </product-modal>
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="cancelTag"
        :visible="addTagStatus > 0"
        :title="addTagTitle"
        width="580px"
      >
        <el-form ref="tagForm" :rules="tagRules" :model="tagForm" size="small" label-width="80px">
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="tagForm.name" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="addTagStatus === 2" type="primary" @click="submitTag">确认</el-button>
          <el-button @click="cancelTag">取消</el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import activities from '@/api/activities'
import tags from '@/api/tag'
import product from '@/api/product'

import moment from 'moment'
import SharingSetting from './sharingSetting.vue'
import InvitingSetting from './invitingSetting.vue'
import Step from '../step.vue'
import productModal from '@/components/Product/Modal.vue'
import productList from '@/components/Product/list.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    SharingSetting,
    InvitingSetting,
    productModal,
    productList,
    Step
  },
  data() {
    return {
      loading: false,
      addTagStatus: 0,
      addTagTitle: '创建标签',
      tagForm: {
        name: null,
        type: null,
        position: null
      },
      tagRules: {
        name: [{
          required: true, message: '不能为空', trigger: 'blur'
        }]
      },
      rules: {
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        startAt: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        endAt: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        weekValue: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        startHour: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) <= -1) {
              callback(new Error('必须大于或等于 0'))
            } else {
              callback()
            }
          } }
        ],
        endHour: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) > 24) {
              callback(new Error('必须小于或等于 24'))
            } else {
              callback()
            }
          } }
        ],
        attendRuleDays: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 1) {
              callback(new Error('必须大于0'))
            } else {
              callback()
            }
          } }
        ],
        attendRuleTimes: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 1) {
              callback(new Error('必须大于0'))
            } else {
              callback()
            }
          } }
        ],
        scheduledDateValue: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        sharingTitle: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        sharingLink: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      activity: { page: {}},
      types: [],
      pageTypes: [],
      defaultTime: moment().format('HH:mm:ss'),
      modal: {
        product: false
      },
      detail: {},
      product: {},
      activityTagList: [],
      userTagList: [],
      unitSpecList: [],
      form: {
        kind: null,
        type: null,
        pageType: null,
        title: null,
        startAt: null,
        endAt: null,
        cycleEnabled: false,
        paused: false,
        cycleType: 'every_day',
        scheduledDateValue: '',
        weekValue: [],
        startHour: 0,
        endHour: 24,
        attendRule: 'none',
        attendRuleDays: null,
        attendRuleTimes: null,
        productId: null,
        activityTagIds: [],
        activityUserTagIds: [],
        note: null,
        suiteAwardEnabled: false,
        unitSpecId: null,
        multiTakeEnabled: false,
        takenCount: 0,
        sharingTitle: null,
        sharingDesc: null,
        sharingLink: null,
        sharingImgId: null,
        sharingImgUrl: null,
        invitingCount: null,
        invitedRebateEnabled: false,
        invitedGoodId: null,
        parentId: null,
        portalEnabled: false,
        state: 'pending'
      }
    }
  },
  computed: {
    pageTypeName() {
      const obj = this.pageTypes.find(i => i.key === this.form.pageType)
      const name = obj ? obj.value : ''
      return name
    },
    ...mapGetters(['account'])
  },
  watch: {
    'form.startHour'(newVal) {
      if (this.form.endHour < newVal) {
        this.form.endHour = newVal
      }
    },
    'form.productId'(newValue, oldValue) {
      if (oldValue && newValue) {
        this.form.unitSpecId = null
      }
      if (newValue && this.form.suiteAwardEnabled) {
        this.getUnitSpecList()
      }
      if (!newValue) {
        this.form.unitSpecId = null
        this.unitSpecList = []
      }
    },
    'form.suiteAwardEnabled'(newValue) {
      if (newValue && this.form.productId) {
        this.getUnitSpecList()
      } else {
        this.unitSpecList = []
      }
    }
  },
  mounted() {
    const that = this
    if (this.$route.name === 'ActivityEdit') {
      activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
        activities.prepare({ type: data.type, pageType: data.pageType, kind: data.kind }).then(response => {
          that.activity = response.data
        })
        this.detail = data
        this.$store.dispatch('breadcrumb/set_breadcrumb', [
          { title: '活动列表', path: '/admin/activities', type: 'external' },
          { title: data.title, path: { name: data.state === 'pending' ? 'ActivityEdit' : 'ActivityShow', params: { activityId: this.$route.params.activityId }}},
          { title: '编辑活动' }
        ])
      })
      activities.base_info({ id: this.$route.params.activityId }).then(({ data }) => {
        this.$nextTick(() => {
          this.form = { ...this.form, ...data }
          this.product = data.product || {}
        })
      })
    } else {
      const { parent_id, type, page_type, kind } = this.$route.query
      activities.prepare({ type: this.$route.query.type, pageType: this.$route.query.page_type, kind: this.$route.query.kind }).then(({ data }) => {
        this.activity = data
      })

      if (parent_id) {
        // activities.base_info({ id: parent_id }).then(({ data }) => {
        //   this.$nextTick(() => {
        //     this.form = { ...this.form, ...data }
        //     this.product = data.product || {}
        //   })
        // })
        this.form.parentId = parent_id
      }
      this.form.type = type
      this.form.kind = kind
      this.form.pageType = page_type
    }

    activities.pageType().then(({ data }) => {
      this.pageTypes = data
    })
    this.getActivityTagList()
    this.getUserTagList()
  },
  methods: {
    getActivityTagList() {
      tags.all({ type: 'ActivityTag' }).then(({ data }) => {
        this.activityTagList = data
      })
    },
    getUserTagList() {
      tags.all({ type: 'UserTag' }).then(({ data }) => {
        this.userTagList = data
      })
    },
    getUnitSpecList() {
      if (this.form.productId) {
        product.t_unit_specs({ productId: this.form.productId }).then(response => {
          this.unitSpecList = response.data.map(item => { return { id: item.id, unitSpecName: item.specLabel } })
        })
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const action = this.form.id ? 'edit' : (this.form.parentId ? 'add_child' : 'add')
          activities[action](this.form).then(({ data }) => {
            this.loading = false
            if (action === 'edit' && this.detail.state !== 'pending') {
              this.$router.push({ name: 'ActivityShow', params: { activityId: data.id }})
            } else {
              this.$router.push({ name: 'ActivityAdvanceEdit', params: { activityId: data.id }})
            }
          }).catch(fail => {
            this.loading = false
          })
        }
      })
    },
    enter() {
      this.$router.push({ name: 'ActivityWizardCheck', params: { activityId: this.$route.params.activityId }})
    },
    selectProduct(data) {
      this.form.productId = data.id
      this.modal.product = false
      this.product = data
    },
    cancelTag() {
      this.addTagStatus = 0
      this.tagForm.type = null
      this.tagForm.name = null
      this.tagForm.position = null
      this.$refs.tagForm.resetFields()
    },
    submitTag() {
      this.$refs.tagForm.validate(valid => {
        if (valid) {
          this.addTagStatus = 2
          tags.add(this.tagForm).then(response => {
            this.form[this.tagForm.position].push(response.data.id)
            if (this.tagForm.type === 'UserTag') {
              this.getUserTagList()
              this.cancelTag()
            }
            if (this.tagForm.type === 'ActivityTag') {
              this.getActivityTagList()
              this.cancelTag()
            }
          }).catch(fail => {
            this.addTagStatus = 1
          })
        }
      })
    },
    addTag(type, position) {
      this.tagForm.type = type
      this.tagForm.position = position
      this.addTagStatus = 1
    }
  }
}
</script>
