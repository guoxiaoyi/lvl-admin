<template>
  <div class="app-container">
    <div class="alert alert-info" role="alert">
      <i class="fa fa-alert-notice fa-lg" /> 活动基础设置应用于全局活动，针对单独活动的规则请至活动详情页操作设置。
    </div>
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="兑奖有效期">
            <el-input v-model="form.attendingExpiredDays">
              <template slot="append">天</template>
            </el-input>
            <p class="help-block">未提交兑奖订单超过有效期后将无法提交，视为放弃兑奖</p>
          </el-form-item>
          <el-form-item label="参与次数规则">
            <el-radio-group v-model="form.attendRule">
              <el-radio :label="'none'">不限制参与次数</el-radio>
              <el-radio :label="'once'">1个用户最多参与1次</el-radio>
              <el-radio :label="'once_a_day'">1个用户1天最多参与1次</el-radio>
              <el-radio :label="'custom'">自定义参与频率</el-radio>
            </el-radio-group>

            <div v-if="form.attendRule === 'custom'" class="el-custom-input-group" style="margin-top: 15px;">
              <div class="el-input-group-addon">1个用户</div>
              <el-input v-model="form.attendRuleDays" />
              <div class="el-input-group-addon">天，最多参与</div>
              <el-input v-model="form.attendRuleTimes" />
              <div class="el-input-group-addon">次</div>
            </div>
            <div class="child-form">
              <el-form-item label="应该范围">
                <el-radio-group v-model="form.attendType">
                  <el-radio label="none">全部活动</el-radio>
                  <el-radio label="custom_activities">部分活动</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.attendType === 'custom_activities'" label=" ">
                <el-select
                  v-model="form.attendActivities"
                  size="small"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入"
                  :remote-method="remoteActiveMethod"
                  :loading="searchActiveLoading"
                  multiple
                >
                  <el-option
                    v-for="item in activityList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="礼品不足提示">
            <el-input v-model="form.goodShortageAlert" placeholder="礼品库存不足,暂时无法兑奖" />
            <p class="help-block">当活动中礼品库存不足时，给用户提示本信息</p>
          </el-form-item>
          <el-form-item label="实名认证金额">
            <el-input v-model="form.checkNameAmountLimit">
              <template slot="append">元</template>
            </el-input>
            <p class="help-block">当领取红包达到设置金额时，需要输入微信认证的姓名。默认为大于等于200元时进行实名认证。</p>
          </el-form-item>
        </el-form>
        <hr>
        <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/attendable_edit.vue'
import activities from '@/api/activities'
import attendable_edit from '@/api/attendable_edit'
export default {
  components: { tab },
  data() {
    return {
      submitting: false,
      activityList: [],
      searchActiveLoading: false,
      form: {
        attendingExpiredDays: null,
        attendRule: 'none',
        attendType: 'none',
        attendActivities: [],
        attendRuleTimes: 1,
        goodShortageAlert: null,
        attendRuleDays: 1,
        checkNameAmountLimit: 200
      },
      rules: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动设置' }
    ])
    activities.list({ }).then(response => {
      this.activityList = response.data.content
    })
    attendable_edit.show().then(({ data }) => {
      this.form = data
    })
  },
  methods: {
    remoteActiveMethod(query) {
      if (query !== '') {
        this.searchActiveLoading = true
        setTimeout(() => {
          activities.list({ search: query.toLowerCase() }).then(response => {
            this.searchActiveLoading = false
            this.activityList = response.data.content
          })
        }, 200)
      }
    },
    submit() {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          this.submitting = true
          attendable_edit.edit(this.form).then(response => {
            this.$message.success('更新成功')
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
</script>

<style lang="scss" scoped>

::v-deep {
  .el-radio {
    display: block;
    margin-top: 9px;
  }
  .el-textarea .el-input__count {
    bottom: 1px;
  }
  .form-item-tinymce, .form-item-table, .form-item-toast{
    .el-form-item__content {
      width: auto;
    }
  }
  .el-input-group__prepend,
  .el-input-group__append {
    color: #555 !important;
    background-color: #EEE !important;
    border-color: #CCC !important;
  }
}
</style>
