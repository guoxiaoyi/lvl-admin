<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="二维码余额">
            <div class="flex red">
              <el-statistic group-separator="," :precision="0" :value="account.store.unitsBalance" />个
            </div>
          </el-form-item>
          <el-form-item label="数量" prop="amount">
            <el-input v-model.number="form.amount">
              <template slot="append">个</template>
            </el-input>
            <p class="help-block">单次生成的总二维码数量，最多100万</p>
          </el-form-item>
          <el-form-item label="起止序号" class="lon_lat">
            <div class="flex" style="width: 500px;">
              <el-input v-model.number="unitsGeneratedMaxSn" :disabled="true" />
              <span class="input-group-addon" style="width: 10px;">-</span>
              <el-input v-model.number="snEnd" :disabled="true" />
            </div>
          </el-form-item>
          <el-form-item label="消耗二维码额度">
            <div class="red">{{ form.amount || 0 }}</div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note" type="textarea" :rows="3" />
          </el-form-item>
          <hr>
          <el-button :loading="submitting" type="success" :disabled="!checkPer(['unit_export_manage'])" @click="submit">提交</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/units_exports.vue'
import { mapGetters } from 'vuex'
import units_exports from '@/api/units_exports'

export default {
  components: {
    tab
  },
  data() {
    return {
      form: {
        amount: 1,
        note: null
      },
      rules: {
        amount: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      submitting: false
    }
  },
  computed: {
    ...mapGetters(['account']),
    unitsGeneratedMaxSn() {
      return this.account.store.unitsGeneratedMaxSn + 1
    },
    snEnd() {
      return ((parseInt(this.form.amount) || 1) + parseInt(this.unitsGeneratedMaxSn) - 1)
    }
  },
  watch: {
    'form.amount'(newValue) {
      if (!parseInt(Number(newValue).toFixed(0)) || parseInt(Number(newValue).toFixed(0)) <= 0) {
        this.form.amount = null
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '二维码生成' }
    ])
    if (!this.account.store.hasUnitUnzipPwd) {
      this.$confirm('为了您的二维码数据安全，请先前往安全设置页面，设置二维码解压密码。', '安全提示', {
        confirmButtonText: '前往设置',
        showCancelButton: false,
        confirmButtonClass: '',
        closeOnClickModal: false,
        type: 'warning',
        center: true
      }).then(() => {
        this.$router.push({ name: 'StoreSecuritySetting' })
      }).catch(() => {
      })
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          units_exports.add(this.form).then(response => {
            this.submitting = false
            this.$router.push({ name: 'AntiUnitsExportIndex' })
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

.red {
  color: #d8120e;
  font-size: 18px;
  font-weight: bold;
}
.input-group-addon {
  display: flex;
  width: 270px;
  align-items: center;
  border-left: 0;
  border-right: 0;
}
::v-deep {
  .el-input-group__prepend,
  .el-input-group__append {
    color: #555 !important;
    background-color: #EEE !important;
    border-color: #CCC !important;
  }
  .lon_lat .el-form-item__content .el-input-group,
  .el-address .el-form-item__content {
    display: flex;
  }
  .lon_lat .el-input:first-child input{
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  .lon_lat .el-input:last-child input{
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  .lon_lat .input-group-addon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
