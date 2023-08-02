<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ this.$route.name === 'VerifiedCouponRuleNew' ? '新建' : '编辑' }}奖励规则
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="返利标题" prop="title">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="核销卡券" prop="goodId">
            <el-select
              v-model="form.goodId"
              size="small"
              clearable
              filterable
              placeholder="请选择"
              :disabled="$route.name === 'VerifiedCouponRuleEdit'"
            >
              <el-option v-for="item in goodsList" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
            <p class="help-block">选择参与核销奖励的自主卡券礼品，列表中没有想要的卡券礼品？<router-link :to="{ name: 'GoodsListNew', query: { type: 'coupon'} }" target="_blank">点击新建卡券</router-link>。</p>
          </el-form-item>
          <el-form-item label="奖励礼品" prop="rewardGoodId">
            <el-input v-model="rewardGoods.name" :disabled="true">
              <template v-if="$route.name === 'VerifiedCouponRuleNew'" slot="append">
                <el-button @click="goodsModal = true">选择</el-button>
              </template>
            </el-input>
            <p class="help-block">选择核销后奖励礼品，列表中没有想要的礼品？点击<router-link :to="{ name: 'GoodsListNew'}" target="_blank">新建礼品</router-link></p>
            <div v-if="Object.keys(rewardGoods).length" class="panel panel-default" style="line-height: 1.4; margin-top: 15px;">
              <el-table :data="[rewardGoods]">
                <el-table-column label="图片" prop="imageList" width="80px">
                  <template slot-scope="scope">
                    <custom-img :image="scope.row.imageList[0]" :size="{width: '60px', height: '60px' }" />
                  </template>
                </el-table-column>
                <el-table-column label="名称">
                  <template slot-scope="scope">
                    <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.id}}" class="name">
                      {{ scope.row.name }}
                    </router-link>
                    <span v-else>{{ scope.row.name }}</span>
                    <goods-price :detail="scope.row" />
                  </template>
                </el-table-column>
                <el-table-column label="类型" prop="typeName" width="120px" />
                <el-table-column label="库存" prop="stockQuantity" width="80px" />
              </el-table>
            </div>
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
    <goods-dialog v-if="goodsModal" :show.sync="goodsModal" :except="['other', 'coupon']" :type-in="typeIn">
      <template slot="action" slot-scope="row">
        <el-button type="text" @click="select(row.data)">选择</el-button>
      </template>
    </goods-dialog>
  </div>
</template>

<script>
import goods from '@/api/goods'
import coupon_verification_reward_rule from '@/api/coupon_verification_reward_rule'

import GoodsDialog from '@/components/Goods/modal.vue'
import CustomImg from '@/components/Image/goods'
import GoodsPrice from '@/components/Goods/Price'

export default {
  components: { GoodsDialog, CustomImg, GoodsPrice },
  data() {
    return {
      goodsModal: false,
      goodsList: [],
      submitting: false,
      searchLoading: false,
      rules: {
        title: {
          required: true, message: '不能为空', trigger: 'blur'
        },
        goodId: {
          required: true, message: '不能为空', trigger: 'blur'
        },
        rewardGoodId: {
          required: true, message: '不能为空', trigger: 'blur'
        }
      },
      typeIn: {
        red_pack: [{ value: '小额红包', key: 'Good::CashGood' }]
      },
      form: {
        title: null,
        goodId: null,
        rewardGoodId: null,
        note: null,
        state: true
      },
      rewardGoods: {}
    }
  },
  mounted() {
    if (this.$route.params === 'VerifiedCouponRuleNew') {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '核销奖励设置', path: { name: 'VerifiedCouponRuleIndex' }}, { title: '新建奖励规则' }])
    } else {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '核销奖励设置', path: { name: 'VerifiedCouponRuleIndex' }}, { title: '编辑奖励规则' }])
    }
    goods.index({ category: 'coupon', size: 10000, typeIn: 'Good::LflCoupon' }).then(({ data }) => {
      this.goodsList = data.content
    })
    if (this.$route.name === 'VerifiedCouponRuleEdit') {
      coupon_verification_reward_rule.show({ id: this.$route.params.id }).then(({ data }) => {
        this.form = data
        this.rewardGoods = data.rewardGoods
      })
    }
  },
  methods: {
    select(data) {
      this.goodsModal = false
      this.rewardGoods = data
      this.form.rewardGoodId = data.id
    },
    submit() {
      const action = this.$route.name === 'VerifiedCouponRuleEdit' ? 'edit' : 'add'
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          coupon_verification_reward_rule[action](this.form).then(({ data }) => {
            this.$message.success(`${this.$route.name === 'VerifiedCouponRuleNew' ? '创建' : '保存'}成功`)
            this.submitting = false
            this.$router.push({ name: 'VerifiedCouponRuleIndex' })
          }).catch(fail => {
            this.submitting = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
