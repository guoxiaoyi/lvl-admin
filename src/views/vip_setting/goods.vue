<template>
  <el-form-item label="注册有礼">
    <el-switch v-model="hasGoodsId" />
    <p class="help-block">开启后，成功注册会员的用户，发放此礼品。列表中没有想要的礼品？<router-link target="_blank" :to="{ name: 'GoodsListNew' }">点击新建礼品</router-link></p>
    <div v-if="hasGoodsId" class="child-form">
      <el-form-item label="选择礼品">
        <el-input v-model="goodsModal.goods.name" :disabled="true" placeholder="请点击右侧按钮选择">
          <template slot="append"><el-button type="success" @click="goodsModal.status = true">选择</el-button></template>
        </el-input>
        <div v-if="Object.keys(goodsModal.goods).length" class="panel panel-default" style="line-height: 1.4; margin-bottom: 0; margin-top: 15px;">
          <el-table :data="[goodsModal.goods]">
            <el-table-column label="图片" prop="imageList" width="80px">
              <template slot-scope="scope">
                <custom-img :image="scope.row.imageList[0]" :size="{width: '60px', height: '60px' }" />
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.id}}" class="name" target="_blank">
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
        <p class="help-block">开启后，当所设置的礼品库存为0时，停止奖励</p>
      </el-form-item>
      <slot name="customForm" />
      <GoodsDialog v-if="goodsModal.status" :show.sync="goodsModal.status" :except="['red_pack', 'other', 'suite_card']" :type-in="typeIn">
        <template slot="action" slot-scope="row">
          <el-button type="text" @click="selectGoods(row.data)">选择</el-button>
        </template>
      </GoodsDialog>
    </div>
  </el-form-item>
</template>

<script>
import GoodsDialog from '@/components/Goods/modal.vue'
import CustomImg from '@/components/Image/goods'
import GoodsPrice from '@/components/Goods/Price'

export default {
  components: {
    GoodsDialog,
    CustomImg,
    GoodsPrice
  },
  props: {
    defaultGoods: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: [Number, String],
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      goodsModal: {
        status: false,
        goods: {}
      },
      hasGoodsId: false,
      registerForm: {
        goodId: null
      },
      typeIn: {
        coupon: [{ key: 'Good::LflCoupon', value: '自主卡券' }]
      }
    }
  },
  watch: {
    hasGoodsId: {
      handler(newValue) {
        if (!newValue) {
          this.$emit('input', null)
        } else {
          this.$emit('input', this.goodsModal.goods.id)
        }
      },
      immediate: true
    },
    defaultGoods: {
      handler(newVal) {
        if (newVal) {
          this.goodsModal.goods = newVal
          if (newVal.id) {
            this.hasGoodsId = true
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    selectGoods(data) {
      this.goodsModal.goods = data
      this.$emit('input', data.id)
      this.goodsModal.status = false
    }
  }
}
</script>
