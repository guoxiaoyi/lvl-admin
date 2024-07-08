<template>
  <div class="app-container">
    <div v-if="detail.parentId" class="alert alert-info" role="alert">
      <i class="fa fa-alert-info fa-lg" /> 当前正在编辑子活动，
      <router-link v-if="detail.parentId" :to="{ name: 'ActivityShow', params: {activityId: detail.parentId }}">点击返回主活动</router-link>
    </div>
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.meta.title }}
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <Step :active="5" :activity="detail" />
        <div class="wizard_confirm_area">
          <div class="success_icon text-success"><i class="fa fa-check-circle" /></div>
          <p v-if="detail.type=== 'Activity'">
            活动创建成功，请添加人次
          </p>
          <p v-else-if="detail.parentId">
            活动创建成功!
          </p>
          <p v-else>
            活动创建成功，请添加二维码
          </p>
          <div class="btn_groups">
            <div v-if="!detail.parentId">
              <template v-if="detail.kind === 'normal' && checkPer(['activity_update'])">
                <template v-if="!(detail.state === 'pending' && detail.traced)">
                  <el-button type="success" @click="modal.units.status = 1"> {{ detail.type === 'Activity' ? '添加人次' : '添加二维码' }} </el-button>
                </template>
              </template>
              <template v-if="detail.kind === 't_unit' && checkPer(['activity_update'])">
                <template v-if="!(detail.state === 'pending' && detail.traced)">
                  <el-dropdown @command="handle_amount_increment">
                    <el-button type="success"> 添加二维码 </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="TUnitsIncrementReceipt">出库单添加</el-dropdown-item>
                      <el-dropdown-item command="TUnitsIncrementBatch">生产批次添加</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </template>
              <div>
                <el-button @click="$router.push({ name: 'ActivityShow', params: { activityId: $route.params.activityId }})">稍后添加</el-button>
              </div>
            </div>
            <div v-else>
              <router-link :to="{ name: 'ActivityShow', params: { activityId: $route.params.activityId }}" class="el-button">查看详情</router-link>
            </div>
            <div>
              <el-button @click="preview">预览活动</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show"
      width="300px"
      title="活动预览"
      top="10vh"
    >
      <VueQr ref="Qrcode" :text="detail.mobilePreviewUrl" class="img-thumbnail" :size="600" />
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
  </div>
</template>

<script>
import activities from '@/api/activities'
import cash_trans from '@/api/cash_trans'
import Step from './components/step.vue'
import VueQr from 'vue-qr'
import { mapGetters } from 'vuex'
export default {
  components: {
    Step,
    VueQr
  },
  data() {
    return {
      detail: {
        page: {}
      },
      modal: {
        tag: {
          status: 0,
          add: 0
        },
        units: {
          status: 0
        }
      },
      show: false,
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
      }
    }
  },
  computed: {
    ...mapGetters(['account', 'activityData']),
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
    }
  },
  watch: {
    'modal.units.status'(newValue) {
      if (newValue === 1) {
        if (this.detail.type !== 'Activity') {
          this.retry_allocatable_sn_ranges()
        }
      }
    }
  },
  async mounted() {
    this.detail = this.activityData
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.detail.title, path: { name: 'ActivityEdit', params: { activityId: this.$route.params.activityId }}},
      { title: '确认活动' }
    ])
  },
  methods: {
    handle_amount_increment(command) {
      this.$router.push({ name: 'ActivityTunitIncrementNew', query: { type: command }})
    },
    preview() {
      this.show = true
    },
    cancelActivityIncrement() {
      this.modal.units.status = 0
    },
    amount_increment() {
      this.$refs.unitsForm.validate(valid => {
        if (valid) {
          if (confirm('是否确认操作？')) {
            this.modal.units.status = 2
            if (this.detail.type === 'Activity') {
              this.unitsForm.type = null
            }
            activities.amount_increment({ ...this.unitsForm, id: this.$route.params.activityId }).then(({ data }) => {
              this.modal.units.status = 0
              this.$message.success('添加成功')
              this.$router.push({ name: 'ActivityShow', params: { activityId: this.$route.params.activityId }})
            }).catch(fail => {
              this.modal.units.status = 1
            })
          }
        }
      })
    },
    retry_allocatable_sn_ranges() {
      this.unitsLoading = 0
      cash_trans.allocatable_sn_ranges().then(({ data }) => {
        this.unitsLoading = 1
        this.unitsForm.data = data || []
        if (data.length > 0) {
          this.unitsForm.snStart = data[0].split('~')[0]
        }
      }).catch(fail => {
        this.unitsLoading = 2
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.wizard_confirm_area{
  text-align: center;

  .success_icon{
    font-size: 80px;
  }

  .btn_groups{
    margin-top: 60px;

    .btn{
      width: 200px;
    }
  }
}
.fa-question-circle-o {
  color: #da120e;
}
.btn_groups {
  ::v-deep {
    .el-button {
      width: 200px;
      margin: 5px;
    }
  }
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
</style>
