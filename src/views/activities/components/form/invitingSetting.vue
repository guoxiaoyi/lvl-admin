<template>
  <div>
    <h5>分享设置</h5>
    <hr>
    <el-form-item
      label="最大分享人数"
      prop="invitingCount"
      :rules="invitingCountRules"
    >
      <el-input v-model.number="form.invitingCount" :disabled="form.state !== 'pending'" />
      <p class="help-block">设置最大可分享几人参与活动，最多5人</p>
    </el-form-item>
    <el-form-item label="分享达标奖励">
      <el-switch v-model="form.invitedRebateEnabled" />
      <p class="help-block">开启后，成功分享上述指定人数参与活动，发起人可额外获得奖励</p>
      <el-form-item v-if="form.invitedRebateEnabled" style="margin-top: 15px;" prop="invitedGoodId" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
        <el-input v-model="goods.name" :disabled="true" placeholder="请点击右侧按钮选择">
          <template slot="append"><el-button type="success" @click="modal.goods = true">选择</el-button></template>
        </el-input>
        <p class="help-block">
          列表中没有想要的礼品？点击<router-link :to="{ name: 'GoodsListNew'}" target="_blank">新建礼品</router-link>
        </p>
      </el-form-item>
    </el-form-item>
    <GoodsModal :show.sync="modal.goods" :except="['other', 'coupon', 'suite_card']">
      <template slot="action" slot-scope="row">
        <el-button type="text" @click="select(row.data)">选择</el-button>
      </template>
    </GoodsModal>
  </div>
</template>

<script>
import GoodsModal from '@/components/Goods/modal.vue'
// import ProductList from '@/components/Product/list.vue'
export default {
  components: {
    GoodsModal
  },
  props: {
    activity: {
      type: Object,
      default: () => {
        return {}
      }
    },
    form: {
      type: Object,
      default: () => {
        return {
          sharingTitle: null
        }
      }
    }
  },
  data() {
    return {
      modal: {
        goods: false
      },
      goods: {},
      invitingCountRules: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('必须是整数'))
          } else if (Number(value) < 2) {
            callback(new Error('必须大于1'))
          } else if (Number(value) > 5) {
            callback(new Error('必须小于等于5'))
          } else {
            callback()
          }
        } }
      ]
    }
  },
  watch: {
    form(newValue) {
      console.log(4)
      if (newValue.invitedGood) {
        this.goods = newValue.invitedGood
        this.form.invitedGoodId = this.goods.id
      }
    }
  },
  mounted() {
    if (this.form.invitedGood) {
      this.goods = this.form.invitedGood
      this.form.invitedGoodId = this.goods.id
    }
  },
  methods: {
    select(data) {
      this.goods = data
      this.modal.goods = false
      this.form.invitedGoodId = data.id
    }
  }
}
</script>
