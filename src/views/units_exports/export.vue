<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="数量">
            <el-input v-model.number="form.amount" placeholder="请输入要导出二维码数量">
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
          <el-form-item label="可导出号段">
            <span v-if="all_sn_ranges_loading">
              <i class="el-icon-loading" />
            </span>
            <div v-else>
              {{ all_sn_ranges.join(', ') }}
            </div>
          </el-form-item>
          <el-form-item label="起止序号" class="lon_lat">
            <div class="flex" style="width: 500px;">
              <el-input v-model.number="form.snStart" />
              <span class="input-group-addon" style="width: 10px;">-</span>
              <el-input v-model.number="snEnd" :disabled="true" />
            </div>
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
import units_exports from '@/api//units_exports'

export default {
  components: {
    tab
  },
  data() {
    return {
      form: {
        amount: 1,
        note: null,
        snStart: null
      },
      rules: {},
      submitting: false,
      all_sn_ranges: [],
      all_sn_ranges_loading: true
    }
  },
  computed: {
    ...mapGetters(['account']),
    snEnd() {
      const amount = parseInt(Number(this.form.amount).toFixed(0))
      const snStart = parseInt(Number(this.form.snStart).toFixed(0))
      if (!isNaN(snStart) && amount >= 1) {
        return amount >= 1 ? (amount + snStart - 1) : (amount + snStart)
      } else {
        return null
      }
    }
  },
  watch: {
    'form.amount'(newValue) {
      if (!parseInt(Number(newValue).toFixed(0)) || parseInt(Number(newValue).toFixed(0)) <= 0) {
        this.form.amount = null
      }
    },
    'form.snStart'(newValue) {
      if (isNaN(parseInt(Number(newValue).toFixed(0))) || parseInt(Number(newValue).toFixed(0)) < -1) {
        this.form.snStart = null
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '二维码导出' }
    ])
    units_exports.all_sn_ranges().then(({ data }) => {
      this.all_sn_ranges_loading = false
      if (data.length > 0) {
        this.all_sn_ranges = data
        console.log(data[0])
        this.form.snStart = data[0].split('~')[0]
      }
    }).catch(fail => {
      this.all_sn_ranges_loading = false
    })
    if (this.account.store.hasUnitUnzipPwd) {
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
          units_exports.unitsExport(this.form).then(response => {
            this.submitting = false
            this.$router.push({ name: 'UnitsExportIndex' })
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
