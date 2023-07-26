<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          新建奖励规则
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="返利标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="核销卡券">
            <el-select
              v-model="form.goodId"
              size="small"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option v-for="item in goodsList" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
            <p class="help-block">选择参与核销奖励的卡券，只能选择一个，或<router-link :to="{ name: 'GoodsListNew', query: { type: 'coupon'} }" target="_blank">新建卡券</router-link>。</p>
          </el-form-item>
          <el-form-item label="奖励礼品">
            <el-input v-model="form.rewardGoodId">
              <template slot="append">
                <el-button @click="goodsModal = true">选择</el-button>
              </template>
            </el-input>
            <p class="help-block">选择核销后奖励礼品，列表中没有想要的礼品？点击<router-link :to="{ name: 'GoodsListNew'}" target="_blank">新建礼品</router-link></p>
          </el-form-item>
          <el-form-item label="无库存停止奖励">
            <el-switch v-model="form.noQuantityStop" />
          </el-form-item>
          <el-form-item label="开启奖励">
            <el-switch v-model="form.state" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note" type="textarea" :rows="4" />
          </el-form-item>
        </el-form>
        <el-divider />
        <el-button :loading="submitting" type="success" @click="submit">保存</el-button>
      </div>
    </div>
    <goods-dialog v-if="goodsModal" :show.sync="goodsModal">
      <template slot="action" slot-scope="row">
        <el-button type="text" @click="select(row.data)">选择</el-button>
      </template>
    </goods-dialog>
  </div>
</template>

<script>
import goods from '@/api/goods'
import GoodsDialog from '@/components/Goods/modal.vue'
export default {
  components: { GoodsDialog },
  data() {
    return {
      goodsModal: false,
      goodsList: [],
      submitting: false,
      searchLoading: false,
      rules: {},
      typeIn: {
        red_pack: [{ value: '小额红包', key: 'Good::CashGood' }]
      },
      form: {
        title: null,
        goodId: null,
        rewardGoodId: null,
        noQuantityStop: false,
        note: null,
        state: true
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '新建奖励规则' }])
    goods.index({ category: 'coupon', size: 10000 }).then(({ data }) => {
      this.goodsList = data.content
    })
  },
  methods: {
    select(data) {
      console.log(data)
      this.goodsModal = false
    },
    // remoteMethod(query) {
    //   if (query.toLowerCase() !== '' && query.toLowerCase().length > 1) {
    //     this.searchLoading = true
    //     goods.index({ category: 'coupon', blurry: query.toLowerCase() }).then(response => {
    //       this.searchLoading = false
    //       this.goodsList = response.data.content
    //     })
    //   }
    // },
    submit() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
