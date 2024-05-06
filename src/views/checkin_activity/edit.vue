<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          签到活动
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-row>
          <el-col :span="10">
            <div class="phone-frame" style="margin: 0 auto;">
              <iframe id="previewer" :src="form.checkinUrl + '/demo'" />
              <div class="phone-home-btn" />
            </div>
          </el-col>
          <el-col :span="14">
            <div class="panel panel-default">
              <div class="panel-heading">
                <div class="panel-title"> 设置 </div>
              </div>
              <div class="panel-body">
                <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
                  <el-form-item label="签到开关">
                    <el-switch v-model="form.enabled" />
                  </el-form-item>
                  <el-form-item label="展示样式">
                    <el-radio-group v-model="form.page">
                      <el-radio label="month">月历</el-radio>
                      <el-radio label="week">周历</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="参与用户">
                    <el-radio-group v-model="form.kind">
                      <el-radio label="all">不限制</el-radio>
                      <el-radio label="vip_level">会员等级</el-radio>
                      <el-radio label="tag">标签</el-radio>
                    </el-radio-group>

                    <el-select v-if="form.kind === 'vip_level'" v-model="form.allowedVipLevels" multiple clearable>
                      <el-option
                        v-for="item in vipLevels"
                        :key="item.id+'levels'"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>

                    <el-select v-if="form.kind === 'tag'" v-model="form.allowedTags" multiple clearable>
                      <el-option v-for="item in userTagList" :key="'allowed' + item.id + Math.round(Math.random()*10)" :label="item.name" :value="item.id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="日常签到奖励">
                    <div class="el-custom-input-group">
                      <el-form-item prop="points">
                        <el-input v-model="form.points" />
                      </el-form-item>
                      <div class="el-input-group-addon">积分{{ account.store.vipFuncEnabled ? '加' : '' }} </div>
                      <el-form-item v-if="account.store.vipFuncEnabled" prop="vipXp">
                        <el-input v-model="form.vipXp" />
                      </el-form-item>
                      <div v-if="account.store.vipFuncEnabled" class="el-input-group-addon">成长值</div>
                    </div>
                  </el-form-item>
                  <el-form-item label="每连续签到">
                    <div class="el-custom-input-group">
                      <el-form-item prop="conDays">
                        <el-input v-model="form.conDays" />
                      </el-form-item>
                      <div class="el-input-group-addon">日，额外获得</div>
                      <el-form-item prop="conPoints">
                        <el-input v-model="form.conPoints" />
                      </el-form-item>
                      <div class="el-input-group-addon">积分{{ account.store.vipFuncEnabled ? '加' : '' }} </div>
                      <el-form-item v-if="account.store.vipFuncEnabled" prop="conVipXp">
                        <el-input v-model="form.conVipXp" />
                      </el-form-item>
                      <div v-if="account.store.vipFuncEnabled" class="el-input-group-addon">成长值</div>
                    </div>
                  </el-form-item>
                  <hr>
                  <el-button type="success" :loading="loading" @click="submit">保存</el-button>
                </el-form>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading">
                <div class="panel-title">
                  预览
                </div>
              </div>
              <div class="panel-body">
                <p v-if="!enabled">开启签到有礼并保存后显示。</p>
                <template v-else>
                  <p>签到链接</p>
                  <div style="width: 70%; margin-bottom: 10px;">
                    <div style="opacity: 0; position: fixed;">
                      <el-input ref="copyUrl" v-model="form.checkinUrl" type="textarea" :rows="1" resize="none" />
                    </div>
                    <el-input v-model="form.checkinUrl" :disabled="true">
                      <template slot="append"><el-button type="success" @click="copyClicked">复制</el-button></template>
                    </el-input>
                  </div>
                  <p class="help-block">
                    此链接地址为签到链接地址，您可将此链接地址加入您的公众号菜单，或通过图文发送给用户，方便用户参与。
                  </p>
                  <div style="margin: 30px auto; height: 200px;">
                    <VueQr v-if="form.checkinUrl" :text="form.checkinUrl" :size="400" style="width: 200px;  border: 1px solid #ddd;" />
                  </div>
                  <p style="color: #da120e">扫一扫，预览签到有礼</p>
                </template>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import checkin_activity from '@/api/checkin_activity'
import vip_level from '@/api/vip_level'
import tags from '@/api/tag'
import VueQr from 'vue-qr'
import { mapGetters } from 'vuex'
export default {
  components: {
    VueQr
  },
  data() {
    return {
      loading: false,
      form: {
        enabled: false,
        page: null,
        kind: null,
        points: null,
        vipXp: null,
        conDays: null,
        conPoints: null,
        conVipXp: null,
        storeId: null,
        allowedVipLevels: [],
        allowedTags: []
      },
      enabled: false,
      vipLevels: [],
      userTagList: [],
      rules: {
        points: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 1) {
              callback(new Error('必须大于等于1'))
            } else {
              callback()
            }
          } }
        ],
        vipXp: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 1) {
              callback(new Error('必须大于等于1'))
            } else {
              callback()
            }
          } }
        ],
        conDays: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 3) {
              callback(new Error('必须大于等于3'))
            } else {
              callback()
            }
          } }
        ],
        conPoints: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 1) {
              callback(new Error('必须大于等于1'))
            } else {
              callback()
            }
          } }
        ],
        conVipXp: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (!Number.isInteger(Number(value))) {
              callback(new Error('必须是整数'))
            } else if (Number(value) < 1) {
              callback(new Error('必须大于等于1'))
            } else {
              callback()
            }
          } }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '签到活动' }])
    this.fetch()
    if (this.account.store.vipFuncEnabled) {
      vip_level.list().then(({ data }) => {
        this.vipLevels = data
      })
    }
    tags.all({ type: 'UserTag' }).then(({ data }) => {
      this.userTagList = data
    })
  },
  methods: {
    fetch() {
      checkin_activity.setting().then(({ data }) => {
        this.form = data
        this.enabled = data.enabled
      })
    },
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          checkin_activity.edit(this.form).then(({ data }) => {
            this.$message.success('保存成功')
            this.loading = false
            this.fetch()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
