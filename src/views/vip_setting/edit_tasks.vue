<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 任务管理 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex" style="margin: 40px 0;">
          <div class="phone-frame" style="margin: 0 auto;">
            <iframe id="previewer" :src="_domain+'/mobile/vips/tasks_demo'" />
            <div class="phone-home-btn" />
          </div>
          <el-form ref="form" class="left-form" label-width="120px" :rules="rules" :model="form">
            <div class="panel-default" style="border: 1px solid #ddd">
              <div class="panel-heading">
                <h5>基础任务</h5>
              </div>
              <div class="panel-body">
                <el-form-item label="完善信息" prop="completeInformationXp">
                  <el-checkbox v-model="form.completeInformationEnabled" />
                  <el-input v-model.number="form.completeInformationXp">
                    <template slot="prepend">完成后赠送</template>
                    <template slot="append">成长值</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="绑定手机号" prop="bindPhoneXp">
                  <el-checkbox v-model="form.bindPhoneEnabled" />
                  <el-input v-model.number="form.bindPhoneXp">
                    <template slot="prepend">完成后赠送</template>
                    <template slot="append">成长值</template>
                  </el-input>
                </el-form-item>
                <el-form-item v-if="account.wechatProfile" label="关注公众号" prop="subscribeXp">
                  <el-checkbox v-model="form.subscribeEnabled" />
                  <el-input v-model.number="form.subscribeXp">
                    <template slot="prepend">完成后赠送</template>
                    <template slot="append">成长值</template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="panel-heading">
                <h5>活跃任务</h5>
              </div>
              <div class="panel-body">
                <el-form-item label="参与活动获得" class="join-activity" prop="countAttendings">
                  <el-checkbox v-model="form.attendingEnabled" />
                  <div class="flex" style="width: 500px;">
                    <el-input v-model.number="form.countAttendings">
                      <template slot="prepend">每参与</template>
                    </el-input>
                    <span class="input-group-addon" style="width: 268px;">次活动，获得</span>
                    <el-input v-model.number="form.attendingXp">
                      <template slot="append">成长值</template>
                    </el-input>
                  </div>
                </el-form-item>
                <el-form-item v-if="pointStoreEnabled" label="签到" class="full">
                  <el-checkbox :checked="true" :disabled="true" />
                  <div class="flex help-block" style="justify-content: space-between;">
                    开启，用户签到可获得相应的奖励
                    <a href="/admin/checkin_activity/edit">设置签到</a>
                  </div>
                </el-form-item>
                <el-form-item v-if="cultivateActivityForestEnabled" label="开心种树" class="full">
                  <el-checkbox :checked="true" :disabled="true" />
                  <div class="flex help-block" style="justify-content: space-between;">
                    开启，用户签到可获得相应的奖励
                    <a href="/admin/cultivate_activity/forest">设置游戏</a>
                  </div>
                </el-form-item>
              </div>
              <div class="panel-footer">
                <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vip_setting from '@/api/vip_setting'
import point_store from '@/api/point_store'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      domain: `${process.env.VUE_APP_BASE_DOMAIN}`,
      form: {
        completeInformationEnabled: false,
        completeInformationXp: null,
        bindPhoneEnabled: false,
        bindPhoneXp: null,
        subscribeEnabled: false,
        subscribeXp: null,
        attendingEnabled: false,
        countAttendings: null,
        attendingXp: null
      },
      rules: {
        completeInformationXp: [
          { required: true, message: '数量不能为空', trigger: 'blur' },
          { type: 'number', message: '数量必须是整数', trigger: 'blur', min: 1 }
        ],
        bindPhoneXp: [
          { required: true, message: '数量不能为空' },
          { type: 'number', message: '数量必须是整数', trigger: 'blur', min: 1 }
        ],
        subscribeXp: [
          { required: true, message: '数量不能为空', trigger: 'blur' },
          { type: 'number', message: '数量必须是整数', trigger: 'blur', min: 1 }
        ],
        countAttendings: [
          { required: true, message: '数量不能为空', trigger: 'blur' },
          { type: 'number', message: '数量必须是整数', trigger: 'blur', min: 1 }
        ],
        attendingXp: [
          { required: true, message: '数量不能为空', trigger: 'blur' },
          { type: 'number', message: '数量必须是整数', trigger: 'blur', min: 1 }
        ]
      },
      cultivateActivityForestEnabled: false,
      pointStoreEnabled: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters([
      'account'
    ]),
    _domain() {
      return `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}`
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '任务管理' }
    ])
    point_store.functions().then(response => {
      this.cultivateActivityForestEnabled = response.data.cultivateActivityForestEnabled
      this.pointStoreEnabled = response.data.pointStoreEnabled
    })
    vip_setting.register().then(response => {
      this.form.completeInformationEnabled = response.data.completeInformationEnabled
      this.form.completeInformationXp = response.data.completeInformationXp
      this.form.bindPhoneEnabled = response.data.bindPhoneEnabled
      this.form.bindPhoneXp = response.data.bindPhoneXp
      this.form.subscribeEnabled = response.data.subscribeEnabled
      this.form.subscribeXp = response.data.subscribeXp
      this.form.attendingEnabled = response.data.attendingEnabled
      this.form.countAttendings = response.data.countAttendings
      this.form.attendingXp = response.data.attendingXp
    })
    console.log(this.account)
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          vip_setting.update_task(this.form).then(response => {
            this.$message.success('更新成功')
            this.submitting = false
            setTimeout(() => {
              window.location.reload()
            }, 1000)
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
  .left-form {
    width: 45vw;
  }
  .input-group-addon {
    display: flex;
    width: 270px;
    align-items: center;
    border-left: 0;
    border-right: 0;
  }
  ::v-deep {
    .el-input-group__prepend, .el-input-group__append {
      background: #EEE !important;
      border-color: #CCC !important;
      color: #555 !important;
    }
    .full {
      .el-form-item__content {
        width: calc(100% - 120px);
      }
    }
    .join-activity{
      .el-input__inner {
        border-radius: 0;
      }
    }
  }
</style>
