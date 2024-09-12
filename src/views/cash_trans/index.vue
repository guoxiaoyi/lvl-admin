<template>
  <div class="app-container">
    <div class="store-info">
      <div class="item cash_balance">
        <p>资金余额</p>
        <div class="price">
          <el-statistic
            group-separator=","
            :precision="2"
            :value="account.store.cashBalance"
          />
          <span class="unit">元</span>
        </div>
        <div>
          <el-button type="success" @click="r">充值</el-button>
          <el-button @click="j">提现</el-button>
        </div>
      </div>
      <div class="item units_balance">
        <p>二维码余额</p>
        <div class="price">
          <el-statistic
            group-separator=","
            :precision="0"
            :value="account.store.unitsBalance"
          />
          <span class="unit">个</span></div>
        <div>
          <el-button @click="$router.push({ name: 'UnitsTranIndex' })">二维码明细</el-button>
          <el-button @click="modal.show = true">可分配号段</el-button>
        </div>
      </div>
      <div class="item sms_balance">
        <p>短信余额</p>
        <div class="price">
          <el-statistic
            group-separator=","
            :precision="0"
            :value="account.store.smsBalance"
          />
          <span class="unit">条</span></div>
        <div>
          <el-button type="success" @click="$router.push({ name: 'NewSmsPurchase' })">购买</el-button>
          <el-button @click="$router.push({ name: 'SmsTranIndex' })">短信明细</el-button>
        </div>
      </div>
      <div class="item logistics_balance">
        <p>物流查询余额</p>
        <div class="price">
          <el-statistic
            group-separator=","
            :precision="0"
            :value="account.store.logisticsBalance"
          />
          <span class="unit">次</span></div>
        <div>
          <el-button type="success" @click="$router.push({ name: 'NewLogisticsPurchase' })">购买</el-button>
          <el-button @click="$router.push({ name: 'LogisticsTrans' })">物流明细</el-button>
        </div>
      </div>
      <div class="item miniprogram_phone_balance">
        <p>小程序获取手机号余额</p>
        <div class="price">
          <el-statistic
            group-separator=","
            :precision="0"
            :value="account.store.miniprogramPhoneBalance"
          />
          <span class="unit">次</span></div>
        <div>
          <el-button type="success" @click="$router.push({ name: 'NewMiniprogramPhonePurchase' })">购买</el-button>
          <el-button @click="$router.push({ name: 'MiniprogramPhoneTranIndex' })">验证明细</el-button>
        </div>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <div v-if="!account.isInspector || (account.isInspector && checkPer(['su']))" class="panel-heading">
            <el-button :disabled="!crud.data.length" type="success" @click="exportExcel">导出 Excel</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="时间" prop="createdAt" />
            <el-table-column label="账务类型" prop="nameText" />
            <el-table-column label="收支类型" prop="kindText" />
            <el-table-column label="金额(元)">
              <template slot-scope="scope">
                {{ toPrice(scope.row.amount) }}
              </template>
            </el-table-column>
            <el-table-column label="账户结余(元)">
              <template slot-scope="scope">
                {{ toPrice(scope.row.balance) }}
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note" min-width="200px">
              <template slot-scope="scope">
                <div v-html="scope.row.note" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.show"
      title="可分配号段"
      width="600px"
    >
      <el-form>
        <el-form-item label="号段">
          <span v-if="loading">
            <i class="el-icon-loading" />
          </span>
          <div v-else style="display: flex; flex-direction: column;">
            <div v-for="(item, index) in modal.data" :key="index">{{ item }}</div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modal.show = false">取消</el-button>
      </div>
    </el-dialog>
    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import cash_trans from '@/api/cash_trans'
import BackgroundTask from '@/components/BackgroundTask'
import { mapGetters } from 'vuex'

export default {
  components: {
    BackgroundTask,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '资金明细', url: '/lmp/v2/admin/cash_trans' })
  },
  data() {
    return {
      modal: {
        show: false,
        data: []
      },
      loading: true,
      // 导出
      task: {
        id: null,
        state: false
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '账户概况' }])
    this.crud.refresh()
    this.loading = true
    cash_trans.allocatable_sn_ranges().then(({ data }) => {
      this.loading = false
      this.modal.data = data || []
    }).catch(fail => {
      this.loading = false
    })
  },
  methods: {
    r() {
      window.location.href = '/lmp/portal/admin/recharges/new?type=Alipay'
    },
    j() {
      window.location.href = '/lmp/portal/admin/withdraws/new'
    },
    exportExcel() {
      if (confirm('确认导出数据？')) {
        cash_trans.download({ ...this.crud.query }).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.store-info {
  display: flex;
  flex-wrap: wrap;
  margin-left: -5px;
  margin-right: -5px;
  margin-bottom: 5px;
  .item {
    flex: 0 0 calc(25% - 10px);
    border: 1px solid #ddd;
    margin: 5px;
    background: #FFF;
    padding: 15px;
    .price {
      font-size: 30px;
      color: #f64348;
      display: flex;
      align-items: baseline;
      margin-bottom: 10px;
      .unit {
        font-size: 14px;
        padding: 2px;
      }
    }
    p { color: #999; margin: 0;}
    // &.cash_balance {
    //   background: url("~@/assets/cash.png") right 20px center no-repeat #fff;
    // }
    // &.units_balance {
    //   background: url("~@/assets/QR.png") right 20px center no-repeat #fff;
    // }
    // &.sms_balance {
    //   background: url("~@/assets/sms.png") right 20px center no-repeat #fff;
    // }
    // &.logistics_balance {
    //   background: url("~@/assets/logistics.png") right 20px center no-repeat #fff;
    // }
    // &.miniprogram_phone_balance {
    //   background: url("~@/assets/miniprogram_phone.png") right 20px center no-repeat #fff;
    // }
  }
}
</style>
