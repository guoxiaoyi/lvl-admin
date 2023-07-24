<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 生成套码 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div id="level_t_unit_exports_new_help" class="alert alert-info collapse in" role="alert">
          <ul>
            <li>1. 追溯码最多支持四个层级，一级码为最小包装；根据指定的规格按套生成并建立关联，生成后会扣除二维码额度；</li>
            <li>2. 开启【关联活动码】后，会对一级码生成相应的活动码；活动码在新建活动时扣除额度，导出时不扣除。</li>
          </ul>
        </div>
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="选择产品/包装规格" prop="unitSpecId">
            <el-select v-model="form.unitSpecId">
            </el-select>
            <p class="help-block">选择产品及对应包装规格</p>
          </el-form-item>
          <el-form-item label="生产批次" prop="unitSpecId">
            <el-select v-model="form.unitSpecId">
            </el-select>
            <p class="help-block">没有要选择的批次，<a target="blank" href="/admin/t_unit_batches/new">点击新建</a></p>
          </el-form-item>
          <el-form-item label="二维码余额">
            <el-statistic group-separator="," :value="account.store.unitsBalance" />
          </el-form-item>
          <el-form-item label="追溯码开始序号">
            先空着吧，后续加上
          </el-form-item>
          <el-form-item label="生成套数" prop="unitSpecAmount">
            <el-input-number v-model="form.unitSpecAmount" :controls="false" />
            <p class="help-block">生成需要喷印或粘贴到包装上的套码数量</p>
          </el-form-item>
          <el-form-item label="关联活动码">
            <el-switch v-model="form.packUnitsEnabled" />
            <p class="help-block">开启后，同步生成并关联活动码，用于追溯码活动。</p>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
        <hr>
        <el-button type="success" :loading="submitting" @click="submit">确认生成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import suite_t_unit_exports from '@/api/suite_t_unit_exports'
export default {
  data() {
    return {
      form: {
        unitSpecId: null,
        unitBatchId: null,
        unitSpecAmount: null,
        packUnitsEnabled: false,
        note: null
      },
      submitting: false,
      rules: {
        unitSpecId: {
          required: true, message: '不能为空', trigger: 'blur'
        },
        unitBatchId: {
          required: true, message: '不能为空', trigger: 'blur'
        },
        unitSpecAmount: {
          required: true, message: '不能为空', trigger: 'blur'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯码生成', path: { name: 'SuiteTunitExportIndex' }},
      { title: '生成套码' }
    ])
  },
  methods: {
    submit() {
      if (confirm('确认并生成追溯码，会从您的账户中扣除相应二维码额度，且无法退还，请确认数量正确无误。')) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submitting = true
            suite_t_unit_exports.add(this.form).then(({ data }) => {
              this.$router.push({ name: 'SuiteTunitExportIndex' })
              this.submitting = false
            }).catch(fail => {
              this.submitting = false
            })
          } else {
            return false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-statistic {
    color: #3c763d;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
