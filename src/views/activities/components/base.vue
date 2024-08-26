<template>
  <el-row>
    <el-col :span="18">
      <table class="table table-loose table-hover">
        <tbody>
          <tr>
            <td>编号</td>
            <td>{{ detail.code }}</td>
          </tr>
          <tr>
            <td>活动标题</td>
            <td>{{ detail.title }}</td>
          </tr>
          <tr>
            <td>活动类型</td>
            <td>
              {{ detail.typeText }}
              <span v-if="detail.kind === 't_unit'" class="label label-light"> 追溯码 </span>
            </td>
          </tr>
          <tr>
            <td>互动类型</td>
            <td>{{ detail.pageTypeText }}</td>
          </tr>
          <tr>
            <td>活动时间</td>
            <td>{{ detail.startAt }} 至 {{ detail.endAt }}</td>
          </tr>
          <tr>
            <td>智能启动</td>
            <td v-if="detail.cycleEnabled">
              <table class="table table-loose table-hover">
                <tbody>
                  <tr>
                    <td>启动规则</td>
                    <td> {{ detail.cycleTypeText }} </td>
                  </tr>
                  <tr label="时间段">
                    <td>时间段</td>
                    <td> {{ detail.startHour }} 至 {{ detail.endHour }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td v-else>
              {{ detail.cycleEnabled ? '是' : '否' }}
            </td>
          </tr>
          <tr>
            <td>参与次数规则</td>
            <td>{{ detail.attendRuleText }}</td>
          </tr>
          <tr>
            <td>状态</td>
            <td>
              <span class="label" :class="'label-'+detail.runningState">{{ detail.runningStateText }}</span>
              <template v-if="checkPer(['activity_update']) && !detail.parentId">
                <span v-if="detail.paused" class="label label-success" @click="start">{{ activityState > 0 ? '提交中' : '开始' }}</span>
                <span v-else-if="detail.state === 'enabled'" class="label label-danger" @click="paused">暂停</span>
              </template>
            </td>
          </tr>
          <tr v-if="detail.paused">
            <td>暂停说明</td>
            <td>
              {{ detail.pausedDesc }}
            </td>
          </tr>
          <template v-if="detail.unitsEnabled">
            <tr v-if="detail.type === 'UnitsActivity'">
              <td>一码多扫</td>
              <td v-if="detail.multiTakeEnabled">
                <table class="table table-loose table-hover">
                  <tbody>
                    <tr>
                      <td>扫码次数</td>
                      <td> {{ detail.takenCount }} </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td v-else>
                否
              </td>
            </tr>
            <tr>
              <td>二维码数量</td>
              <td>
                <span class="shadow-text" style="margin-right: 5px; line-height: 1.02;">{{ detail.amount }}</span>
                <template v-if="!detail.parentId">
                  <template v-if="detail.kind === 'normal' && checkPer(['activity_update'])">
                    <template v-if="!(detail.state === 'pending' || detail.traced)">
                      <a href="javascript:void(0)" class="label label-success" @click="addQrAmount">添加</a>
                    </template>
                  </template>
                  <template v-if="detail.kind === 't_unit' && checkPer(['activity_update'])">
                    <template v-if="!(detail.state === 'pending' || detail.traced)">
                      <el-dropdown @command="handle_amount_increment">
                        <a href="javascript:void(0)" class="label label-success">添加</a>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="TUnitsIncrementReceipt">出库单添加</el-dropdown-item>
                          <el-dropdown-item command="TUnitsIncrementBatch">生产批次添加</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </template>
                </template>
              </td>
            </tr>
            <tr>
              <td>总中奖概率</td>
              <td>{{ total_winning_probability_num }}%</td>
            </tr>
            <template v-if="detail.state !== 'pending'">
              <tr>
                <td>抽奖次数</td>
                <td>{{ detail.raffleCount }}</td>
              </tr>
              <tr>
                <td>抽奖进度</td>
                <td>
                  <el-progress :text-inside="true" :stroke-width="24" :percentage="detail.rafflePercentage" status="success" text-color="#FFF" />
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td>二维码数量</td>
              <td>
                <span class="shadow-text" style="margin-right: 5px; line-height: 1.02;">{{ detail.amount }}</span>
                <template v-if="checkPer(['activity_update'])">
                  <template v-if="detail.state !== 'pending'">
                    <a href="javascript:void(0)" class="label label-success" @click="addQrAmount">添加</a>
                  </template>
                </template>
              </td>
            </tr>
            <tr>
              <td>总中奖概率</td>
              <td>{{ total_winning_probability_num }}%</td>
            </tr>
            <template v-if="detail.state !== 'pending'">
              <template v-if="!account.isInspector || (account.isInspector && checkPer(['su']))">
                <tr>
                  <td>{{ $t('activities.url_qr') }}</td>
                  <td>
                    <p v-if="detail.mobileUrl" style="margin-bottom: 5px">
                      <VueQr ref="Qrcode" :text="detail.mobileUrl" class="img-thumbnail img-thumbnail-qr" :size="600" :margin="10" />
                    </p>
                    <el-button type="success" size="mini" @click="download_qr_code">下载二维码</el-button>
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ $t('activities.url') }}
                  </td>
                  <td>
                    <el-popover
                      placement="top"
                      width="200"
                      trigger="click"
                      popper-class="copy-popover"
                    >
                      <div class="content">已复制</div>
                      <el-input slot="reference" v-model="detail.mobileUrl" :readonly="true" @focus="copy">
                        <template slot="prepend"><i class="fa fa-files-o" /></template>
                        <template slot="append">
                          <el-popover
                            placement="top-start"
                            title="活动参与地址"
                            width="200"
                            trigger="hover"
                            content="此链接地址为活动参与地址，您可将此链接地址加入您的公众号菜单，或通过图文发送给用户，方便用户进入参与活动。"
                          >
                            <i slot="reference" class="fa fa-question-circle-o" style="cursor: pointer;" />
                          </el-popover>
                        </template>
                      </el-input>
                    </el-popover>
                  </td>
                </tr>
              </template>
              <tr>
                <td>
                  {{ $t('activities.raffle_count') }}
                </td>
                <td>
                  {{ detail.raffleCount }}
                </td>
              </tr>
              <tr>
                <td>{{ $t('activities.raffle_percentage') }}</td>
                <td>
                  <el-progress :text-inside="true" :stroke-width="24" :percentage="detail.rafflePercentage" status="success" text-color="#FFF" />
                </td>
              </tr>
            </template>
          </template>

          <tr>
            <td>活动产品</td>
            <td v-if="detail.product">
              <div class="panel panel-default" style="margin-bottom: 0;">
                <ProductList v-if="hasProduct" :except="['action', 'price']" :data="[detail.product]" :loading="false" />
              </div>
            </td>
            <td v-else>-</td>
          </tr>
          <tr>
            <td>活动标签</td>
            <td>
              <el-tooltip popper-class="activity-popper" effect="dark" content="点击编辑标签" placement="right">
                <a class="label label-true" @click="modal.tag.status = 1">编辑标签</a>
              </el-tooltip>
              <span v-for="item in detail.activityTags" :key="item.id" class="label label-light">{{ item.name }}</span>
            </td>
          </tr>
          <tr v-if="account.store.advancedUserMgrFunc">
            <td>预设用户标签</td>
            <td v-if="detail.userTags && detail.userTags.length">
              <router-link :to="{ name: 'UserIndex', query: { tagIds: detail.userTags.map(i => i.id) }}">
                <span v-for="(item, index) in detail.userTags" :key="'user-' + item.id" class="label label-light">
                  {{ item.name }}
                  <template v-if="index+1 < detail.userTags.length">, </template>
                </span>
              </router-link>
            </td>
            <td v-else>
              -
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>{{ detail.note }}</td>
          </tr>
          <template v-if="detail.type === 'SharingActivity'">
            <tr>
              <td>{{ $t('activities.sharing_title') }}</td>
              <td>
                {{ detail.sharingTitle }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('activities.sharing_desc') }}</td>
              <td>
                {{ detail.sharingDesc }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('activities.sharing_link') }}</td>
              <td>
                {{ detail.sharingLink }}
              </td>
            </tr>
            <tr>
              <td>{{ $t('activities.sharing_img') }}</td>
              <td>
                <el-image :src="detail.sharingImgUrl" class="img-thumbnail avatar-thumbnail-middle" fit="cover" :preview-src-list="[detail.sharingImgUrl]" />
              </td>
            </tr>
          </template>
          <template v-if="detail.type === 'InvitingActivity'">
            <tr>
              <td>最大分享人数</td>
              <td> {{ detail.invitingCount }}</td>
            </tr>
            <tr>
              <td>分享达标奖励</td>
              <td v-if="detail.invitedRebateEnabled">
                <div class="panel panel-default" style="margin-bottom: 0;">
                  <GoodsList v-if="hasInvitedGood" :list="[detail.invitedGood]" :loading="false" :except="['top','selection','action', 'createdAt', 'accountSet']" />
                </div>
              </td>
              <td v-else>-</td>
            </tr>
          </template>
        </tbody>
      </table>
    </el-col>
    <el-col :span="6">
      <div class="text-center">
        <div style="margin-bottom: 30px; margin-top: 2.5px;">
          <el-button @click="showActivityQRcode = !showActivityQRcode">
            活动预览码
          </el-button>
        </div>
        <div v-show="showActivityQRcode" class="activite_code_preview">
          <div class="thumbnail text-center">
            <h4><i class="fa fa-mobile-phone" /> 活动预览</h4>
            <div class="w">
              <VueQr v-if="detail.mobilePreviewUrl" :text="detail.mobilePreviewUrl" :size="600" :margin="60" />
            </div>
            <div class="caption">
              <p>扫一扫，预览活动</p>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible="modal.tag.status > 0"
      :before-close="closeActivityTag"
      title="编辑活动标签"
      width="780px"
      top="6vh"
    >
      <el-checkbox-group v-model="activityTags">
        <el-row :gutter="20">
          <el-col v-for="item in tagList" :key="item.id" :span="8">
            <el-checkbox :label="item.id">
              {{ item.name }}
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <el-form v-if="modal.tag.add > 0" ref="tagForm" :rules="rules" inline :model="tagForm" size="small" @submit.native.prevent="addTag">
        <el-form-item prop="name" style="width:280px; margin-top: 10px;" :rules="{ required: true, message: '标签名称不能为空', trigger: 'blur' }">
          <el-input v-model="tagForm.name" />
        </el-form-item>
        <el-form-item style=" margin-top: 10px;">
          <el-button :loading="modal.tag.add > 1" type="success" @click="addTag">添加</el-button>
        </el-form-item>
        <el-form-item style=" margin-top: 10px;">
          <el-button @click="modal.tag.add = 0">取消</el-button>
        </el-form-item>
      </el-form>
      <el-button v-else type="text" @click="modal.tag.add = 1">新建标签</el-button>
      <div slot="footer" class="dialog-footer">
        <el-button :loadin="modal.tag.status > 0" type="primary" @click="submit">保存</el-button>
        <el-button @click="modal.tag.status = 0">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelActivityIncrement"
      :visible="modal.units.status > 0"
      title="添加二维码"
      width="780px"
      top="6vh"
    >
      <div class="alert alert-warning" role="alert">
        <h4><i class="fa fa-alert-warning" /> 注意：</h4>
        <ul v-if="detail.type === 'Activity'">
          <li>添加二维码，会影响现有活动的中奖比例，建议先暂停活动，重新配置奖项数量后再开启活动。</li>
          <li>添加二维码，会从您的账户中扣除相应的二维码额度，且无法退还，请确认数量正确无误。</li>
        </ul>
        <ul v-else>
          <template v-if="detail.multiTakeEnabled">
            <li>本活动已开启一码多扫，每个二维码额外增加的扫码人数将消耗二维码余额。实际消耗额度为二维码数量*增加扫码人数。</li>
            <li>额度一经扣除无法退还，请确认数量正确无误。</li>
          </template>
          <template v-else-if="detail.childrenCount > 0">
            <li>本活动已设置子活动，增加的子活动将消耗二维码余额。实际消耗额度为二维码数量*子活动数。</li>
            <li>额度一经扣除无法退还，请确认数量正确无误。</li>
          </template>
          <li>添加号段，会影响现有活动的中奖比例，建议先暂停活动，重新配置奖项数量后再开启活动。</li>
        </ul>
      </div>
      <el-form ref="unitsForm" size="small" label-width="16.6666%" :rules="unitsRules" :model="unitsForm">
        <el-form-item v-if="detail.type === 'Activity'" label="二维码余额">
          <div class="price">
            <el-statistic
              group-separator=","
              :precision="0"
              :value="account.store.unitsBalance"
            />
            <span class="unit">个</span>
          </div>
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input v-model.number="unitsForm.amount">
            <template slot="append">个</template>
          </el-input>
        </el-form-item>
        <template v-if="detail.type !== 'Activity'">
          <el-form-item label="可分配号段">
            <el-button v-if="loadsn" type="text" @click="loadsn = false; retry_allocatable_sn_ranges()">点击查看</el-button>
            <div v-else>
              <div v-if="unitsLoading > 0" style="display: flex; flex-wrap: wrap;">
                <template v-if="unitsLoading > 1">
                  <el-button type="text" @click="retry_allocatable_sn_ranges">重试</el-button>
                </template>
                <template v-else>
                  <template v-if="unitsForm.data.length">
                    <span v-for="(item, index) in unitsForm.data" :key="index" style="margin-right: 10px;">
                      {{ item }}<template v-if="index < unitsForm.data.length-1">,</template>
                    </span>
                  </template>
                  <p v-else class="help-block">当前没有可分配号段，请先<router-link :to="{name: 'UnitsExportNew'}" target="_blank">生成二维码</router-link></p>
                </template>
              </div>
              <span v-else>
                <i class="el-icon-loading" />
              </span>
            </div>


          </el-form-item>
          <el-form-item label="起止序号">
            <div class="el-custom-input-group">
              <el-input v-model.number="unitsForm.snStart" />
              <span class="el-input-group-addon">-</span>
              <el-input v-model.number="snEnd" :disabled="true" />
            </div>
          </el-form-item>
          <template v-if="mult_count > 0">
            <el-form-item label="二维码余额">
              <div class="price">
                <el-statistic
                  group-separator=","
                  :precision="0"
                  :value="account.store.unitsBalance"
                />
                <span class="unit">个</span>
              </div>
            </el-form-item>
            <el-form-item :label="detail.multiTakeEnabled ? '增加扫码人数' : '子活动数'">
              {{ mult_count }}
            </el-form-item>
            <el-form-item label="消耗二维码额度">
              <strong class="text-danger units_amount">
                {{ unitsForm.amount > 0 ? mult_count * unitsForm.amount : 0 }}
              </strong>
            </el-form-item>
          </template>
          <el-form-item label="自动激活">
            <el-switch v-model="unitsForm.autoEnable" />
          </el-form-item>
        </template>
        <el-divider />
        <el-button :loading="modal.units.status > 1" type="success" @click="amount_increment">确认添加</el-button>
        <el-button @click="modal.units.status = 0">取消</el-button>
      </el-form>
    </el-dialog>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelActivityPaused"
      :visible="activityState > 2"
      title="暂停说明"
      width="780px"
      top="6vh"
    >
      <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="activityStateForm">
        <el-form-item label="暂停说明" prop="amount">
          <el-input v-model="activityStateForm.pausedDesc" type="textarea" :rows="3" placeholder="当前活动已暂停，请稍后再试。" />
          <p class="help-block">当暂停活动时，用户扫码页面显示的文字说明</p>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-button type="success" :loading="activityState > 4" @click="activityStateFormSubmit">确定暂停</el-button>
      <el-button @click="activityState = 0">取消</el-button>
    </el-dialog>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeAddQrAlert"
      :visible="needToAddQrAlert"
      title="添加二维码"
      width="660px"
    >
      <div class="flex justify-content__center direction-column">
        <p>添加二维码将会<b style="color: #F34541">改变活动中奖概率</b>，为避免出现部分用户出现未中奖情况。</p>建议暂停活动添加二维码，加码后检查奖项数量及中奖概率无误后再开启活动</div>
      <div v-if="addTunitQr" class="text-center" style="margin: 40px 0 10px 0;">
        <el-button type="success" @click="$router.push({ name: 'ActivityTunitIncrementNew', query: { type: addTunitQrAction, toAddQrAction: 0 }})">暂停并添加</el-button>
        <el-button @click="$router.push({ name: 'ActivityTunitIncrementNew', query: { type: addTunitQrAction, toAddQrAction: 1 }})">直接添加</el-button>
      </div>
      <div v-else class="text-center" style="margin: 40px 0 10px 0;">
        <el-button type="success" @click="toAddQrAction = 0; modal.units.status = 1">暂停并添加</el-button>
        <el-button @click="toAddQrAction = 1; modal.units.status = 1">直接添加</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import tags from '@/api/tag'
import activities from '@/api/activities'
import cash_trans from '@/api/cash_trans'
import ProductList from '@/components/Product/list.vue'
import GoodsList from '@/components/Goods/index.vue'
import { mapGetters } from 'vuex'
import VueQr from 'vue-qr'
import awards from '@/api/awards'

export default {
  components: {
    ProductList,
    GoodsList,
    VueQr
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {
          userTags: []
        }
      }
    }
  },
  data() {
    return {
      needToAddQrAlert: false,
      toAddQrAction: null, // 0 暂停并添加 1 直接添加
      addTunitQr: false,
      addTunitQrAction: null,
      tagList: [],
      activityTags: [],
      modal: {
        tag: {
          status: 0,
          add: 0
        },
        units: {
          status: 0
        }
      },
      rules: {},
      tagForm: {
        type: 'ActivityTag',
        name: null
      },
      unitsLoading: 0,
      unitsForm: {
        amount: null,
        snStart: null,
        data: [],
        autoEnable: true,
        type: 'UnitsIncrement'
      },
      unitsRules: {
        amount: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('码量必须是整数'))
            } else if (Number(value) <= 0) {
              callback(new Error('码量必须大于0'))
            } else {
              callback()
            }
          } }
        ]
      },
      activityState: 0,
      activityStateForm: {
        pausedDesc: null
      },
      total_winning_probability_num: 0,
      loadsn: true,
      total_amount: 0,
      showActivityQRcode: false
    }
  },
  computed: {
    ...mapGetters(['account']),
    snEnd() {
      const amount = parseInt(Number(this.unitsForm.amount).toFixed(0))
      const snStart = parseInt(Number(this.unitsForm.snStart).toFixed(0))
      if (!isNaN(snStart) && amount >= 1) {
        return amount >= 1 ? (amount + snStart - 1) : (amount + snStart)
      } else {
        return null
      }
    },
    mult_count() {
      let mult_count = 0

      if (this.detail.multiTakeEnabled) {
        mult_count = this.detail.takenCount - 1
      } else if (this.detail.childrenCount > 0) {
        mult_count = this.detail.childrenNotPendingCount
      } else {
        mult_count = 0
      }
      return mult_count
    },
    hasProduct() {
      return Object.keys(this.detail.product).length
    },
    hasInvitedGood() {
      return Object.keys(this.detail.invitedGood).length
    }
  },
  watch: {
    'detail.activityTags'(newVal) {
      if (newVal) {
        this.activityTags = newVal.map(i => parseInt(i.id))
      }
    },
    'modal.units.status'(newValue) {
      this.loadsn = this.total_amount > 10000000
      if (newValue === 1) {
        if (this.detail.type !== 'Activity') {
          this.retry_allocatable_sn_ranges()
        }
      }
    }
  },
  mounted() {
    this.fetchTag()
    awards.total_winning_probability({ activityId: this.$route.params.activityId }).then(({ data }) => {
      this.total_winning_probability_num = data
    })
    activities.total_amount().then(({ data }) => {
      this.total_amount = data
    })
  },
  methods: {
    fetchTag() {
      tags.all({ type: 'ActivityTag' }).then(response => {
        this.tagList = response.data
      })
    },
    submit() {
      this.modal.tag.status = 2
      activities.update_tags({ id: this.$route.params.activityId, tagIds: this.activityTags }).then(response => {
        this.modal.tag.status = 0
        this.$emit('callback')
      }).catch(fail => {
        this.modal.tag.status = 0
      })
    },
    closeActivityTag() {
      this.modal.tag.status = 0
    },
    addTag() {
      this.$refs.tagForm.validate(valid => {
        if (valid) {
          this.modal.tag.add = 2
          tags.add(this.tagForm).then(({ data }) => {
            this.modal.tag.add = 1
            this.fetchTag()
            this.$refs.tagForm.resetFields()
            this.activityTags.push(data.id)
          }).catch(fail => {
            this.modal.tag.add = 1
          })
        }
      })
    },
    retry_allocatable_sn_ranges() {
      if (this.loadsn) {
        return
      }
      this.unitsLoading = 0
      this.loadsn = false
      cash_trans.allocatable_sn_ranges().then(({ data }) => {
        this.unitsLoading = 1
        this.unitsForm.data = data || []
        if (data.length > 0) {
          this.unitsForm.snStart = data[0].split('~')[0]
        }
      }).catch(fail => {
        this.unitsLoading = 2
      })
    },
    amount_increment() {
      this.$refs.unitsForm.validate(async valid => {
        if (valid) {
          if (confirm('是否确认操作？')) {
            this.modal.units.status = 2
            if (this.detail.type === 'Activity') {
              this.unitsForm.type = null
            }

            if (this.toAddQrAction === 0) {
              await activities.toggle_paused({ id: this.detail.id }).then(response => {
              }).catch(fail => { })
            }

            activities.amount_increment({ ...this.unitsForm, id: this.$route.params.activityId }).then(async({ data }) => {
              this.modal.units.status = 0
              this.needToAddQrAlert = false
              this.$message.success('添加二维码已在处理，添加完成后自动更新二维码数量及可用号段。')
              await this.$store.dispatch('user/getInfo')
              await this.$store.dispatch('apiData/fetchData', { id: this.$route.params.activityId })
              awards.total_winning_probability({ activityId: this.$route.params.activityId }).then(({ data }) => {
                this.total_winning_probability_num = data
              })
              this.toAddQrAction = null
              this.$emit('callback')
            }).catch(fail => {
              this.modal.units.status = 1
              if (this.toAddQrAction === 0) {
                activities.toggle_paused({ id: this.detail.id }).then(response => {
                }).catch(fail => { })
                this.toAddQrAction = null
              }
            })
          }
        }
      })
    },
    handle_amount_increment(command) {
      if (this.detail.runningState === 'enabled') {
        this.addTunitQr = true
        this.addTunitQrAction = command
        this.needToAddQrAlert = true
      } else {
        this.$router.push({ name: 'ActivityTunitIncrementNew', query: { type: command }})
      }
    },
    start() {
      if (confirm('取消暂停后，活动将恢复原有状态，确定取消暂停吗？')) {
        this.activityState = 1
        activities.toggle_paused({ id: this.detail.id }).then(response => {
          window.location.reload()
        })
      }
    },
    paused() {
      this.activityState = 3
      this.activityStateForm.pausedDesc = this.detail.pausedDesc
    },
    cancelActivityPaused() {
      this.activityState = 0
    },
    cancelActivityIncrement() {
      this.modal.units.status = 0
    },
    activityStateFormSubmit() {
      this.activityState = 5
      activities.toggle_paused({ id: this.detail.id, pausedDesc: this.activityStateForm.pausedDesc }).then(response => {
        window.location.reload()
      }).catch(fail => {
        this.activityState = 3
      })
    },
    copy() {
      const copyText = this.detail.mobileUrl
      // 创建一个临时的文本区域
      var tempArea = document.createElement('textarea')

      // 设置文本区域的内容为我们要复制的文本
      tempArea.value = copyText

      // 防止在屏幕上显示文本区域
      tempArea.style.position = 'fixed'
      tempArea.style.left = '-9999px'

      // 将文本区域添加到页面中
      document.body.appendChild(tempArea)

      // 选择文本区域中的内容
      tempArea.select()
      tempArea.setSelectionRange(0, 99999) // 对于移动设备

      // 执行复制命令
      document.execCommand('copy')

      // 移除文本区域
      document.body.removeChild(tempArea)
    },
    download_qr_code() {
      const iconUrl = this.$refs['Qrcode'].$el.src
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = this.detail.title
      a.href = iconUrl
      a.dispatchEvent(event)
    },
    addQrAmount() {
      if (this.detail.runningState === 'enabled') {
        this.needToAddQrAlert = true
      } else {
        this.modal.units.status = 1
      }
    },
    closeAddQrAlert() {
      this.needToAddQrAlert = false
      this.toAddQrAction = null
    }
  }
}
</script>

<style lang="scss" scoped>

.el-tooltip__popper {
  padding: 5px;
}
.label-true {
  &:hover, &:focus {
    color: #5cb85c;
  }
}
.label {
  cursor: pointer;
}
.price {
  font-size: 18px;
  color: #f64348;
  display: flex;
  align-items: baseline;
  font-weight: bold;
  .unit {
    padding: 2px;
  }
}
.avatar-thumbnail-middle {
  width: 120px;
  height: 120px;
}
::v-deep {
  .el-col {
    margin-bottom: 10px;
  }
}
.fa-question-circle-o {
  color: #da120e;
}
.content {
  text-align: center;
}
.img-thumbnail-qr {
  width: 130px;
}
::v-deep {
  .el-input__inner[readonly="readonly"] {
    background: #EEE;
  }
}
.activite_code_preview {
  width: 100%;
  h4 {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .thumbnail {
    padding: 10px 0;
    background-color: #FBFBFB;
    box-shadow: 4px 0 10px rgba(0,0,0,0.2);
  }
}
.w {
  width: 200px;
  margin: 0 auto;
  img {
    width: 100%;
  }
}
</style>
