<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 生成追溯码 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div id="level_t_unit_exports_new_help" class="alert alert-info collapse in" role="alert">
          <ul>
            <li>1. 追溯码最多支持四个层级，一级码为最小包装；每次只能生成同一个级别的码，生成后会扣除二维码额度；</li>
            <li>2. 码生成以后需要手动进行关联，从最小包装依次向上关联；</li>
            <li>3. 生成一级码时，可选择是否开启【关联活动码】，开启后活动码会与一级码同时生成并关联；活动码在新建活动时扣除额度，导出时不扣除。</li>
          </ul>
        </div>
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="追溯码级别" prop="type">
            <el-select v-model="form.type">
              <el-option label="一级码" value="TUnits::Level1">一级码</el-option>
              <el-option label="二级码" value="TUnits::Level2">二级码</el-option>
              <el-option label="三级码" value="TUnits::Level3">三级码</el-option>
              <el-option label="四级码" value="TUnits::Level4">四级码</el-option>
            </el-select>
            <p class="help-block">一级码为最小包装，逐级增大。如：“瓶-盒-箱-垛”，分别对应“一级-二级-三级-四级”</p>
          </el-form-item>
          <el-form-item label="二维码余额">
            <el-statistic group-separator="," :value="account.store.unitsBalance" />
          </el-form-item>
          <el-form-item label="追溯码开始序号">
            {{ snStart }}
          </el-form-item>
          <el-form-item label="生成数量" prop="amount">
            <el-input v-model="form.amount" onkeyup="value = value.replace(/^0|[^0-9]/g, '')" />
            <p class="help-block">生成需要喷印或粘贴到包装上的追溯码数量</p>
          </el-form-item>
          <el-form-item v-if="form.type === 'TUnits::Level1'" label="关联活动码">
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
import level_t_unit_exports from '@/api/level_t_unit_exports'
import { sn_start } from '@/api/t_unit'
export default {
  data() {
    return {
      form: {
        type: null,
        amount: undefined,
        packUnitsEnabled: false,
        note: null
      },
      submitting: false,
      rules: {
        type: {
          required: true, message: '不能为空', trigger: 'blur'
        },
        amount: {
          required: true, message: '不能为空', trigger: 'blur'
        }
      },
      snStart: null
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯码生成', path: { name: 'LevelTunitExportIndex' }},
      { title: '生成追溯码' }
    ])
    sn_start().then(({ data }) => {
      this.snStart = data
    })
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (confirm('确认并生成追溯码，会从您的账户中扣除相应二维码额度，且无法退还，请确认数量正确无误。')) {
            this.submitting = true
            level_t_unit_exports.add(this.form).then(({ data }) => {
              this.$router.push({ name: 'LevelTunitExportIndex' })
              this.submitting = false
            }).catch(fail => {
              this.submitting = false
            })
          }
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
  .el-statistic {
    color: #3c763d;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
