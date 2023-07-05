<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          购买短信额度
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="资金余额" prop="amount">
            {{ account.store.cashBalance }} 元
          </el-form-item>
          <el-form-item label="物流查询余额">
            {{ account.store.logisticsBalance }} 次
          </el-form-item>
          <el-form-item label="短信套餐" prop="purchasableId">
            <el-radio-group v-model="form.purchasableId">
              <el-radio v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <hr>
        <el-button type="success" :loading="submitting" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import purchase from '@/api/purchase'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      submitting: false,
      rules: {
        purchasableId: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      form: {
        purchasableId: null
      },
      list: []
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '账户概况', path: { name: 'CashTrans' }},
      { title: '购买物流查询额度' }
    ])
    purchase.logistics_service().then(({ data }) => {
      const list = data || []
      this.list = list.sort(function(a, b) {
        return a.amount - b.amount
      })
    })
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          purchase.logistics_purchase(this.form).then(response => {
            this.submitting = false
            this.$message.success('购买成功')
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  label[role="radio"] {
    display: flex;
    margin-top: 10px;
  }
}
</style>
