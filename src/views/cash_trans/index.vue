<template>
  <div class="app-container">
    <div class="store-info">
      <div class="item">
        <div class="price">{{ account.store.cashBalance }}<span class="unit">元</span></div>
        <p>资金余额</p>
        <div>
          <el-button type="success" @click="$router.push({ name: 'RechargeNew', query: { type: 'Alipay' } })">充值</el-button>
          <el-button @click="$router.push({ name: 'WithdrawNew' })">提现</el-button>
        </div>
      </div>
      <div class="item">
        <div class="price">{{ account.store.unitsBalance }}<span class="unit">个</span></div>
        <p>二维码余额</p>
        <div>
          <el-button @click="$router.push({ name: 'UnitsTranIndex' })">二维码明细</el-button>
          <el-button @click="modal.show = true">可分配号段</el-button>
        </div>
      </div>
      <div class="item">
        <div class="price">{{ account.store.smsBalance }}<span class="unit">条</span></div>
        <p>短信余额</p>
        <div>
          <el-button type="success" @click="$router.push({ name: 'NewSmsPurchase' })">购买</el-button>
          <el-button @click="$router.push({ name: 'SmsTranIndex' })">短信明细</el-button>
        </div>
      </div>
      <div class="item">
        <div class="price">{{ account.store.logisticsBalance }}<span class="unit">次</span></div>
        <p>物流查询余额</p>
        <div>
          <el-button type="success" @click="$router.push({ name: 'NewLogisticsPurchase' })">购买</el-button>
          <el-button @click="$router.push({ name: 'LogisticsTrans' })">物流明细</el-button>
        </div>
      </div>
      <!-- <div class="item">
        <div class="price">0<span class="unit">人</span></div>
        <p>企微员工授权余额</p>
        <div>
          <el-button type="success">购买</el-button>
          <el-button>物流明细</el-button>
        </div>
      </div> -->
    </div>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <div class="panel-heading">
            <el-button :loading="crud.downloadLoading" :disabled="!crud.data.length" type="success" @click="crud.doExport">导出 Excel</el-button>
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
            <el-table-column label="备注" prop="note" min-width="200px" />
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
          <div style="display: flex; flex-direction: column;">
            <div v-for="(item, index) in modal.data" :key="index">{{ item }}</div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modal.show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import cash_trans from '@/api/cash_trans'
import { mapGetters } from 'vuex'

export default {
  components: {
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
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '账户概况' }])
    this.crud.refresh()
    cash_trans.allocatable_sn_ranges().then(({ data }) => {
      this.modal.data = data || []
    })
  }
}
</script>

<style lang="scss" scoped>
.store-info {
  display: flex;
  margin-left: -10px;
  margin-right: -10px;
  .item {
    flex: 20%;
    border: 1px solid #ddd;
    margin: 10px;
    background: #FFF;
    padding: 15px;
    .price {
      font-size: 30px;
      color: #f64348;
      .unit {
        font-size: 14px;
        padding: 2px;
      }
    }
    p { color: #999; }
  }
}
</style>
