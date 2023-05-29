<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li class="active"> <a href="javascript:void(0)">会员注册</a></li>
    </ul>
    <div class="panel panel-default table-responsive">
      <div class="flex" style="margin: 40px 0;">
        <div class="phone-frame">
          <iframe id="previewer" :src="registerInfo.mobilePreviewUrl" />
          <div class="phone-home-btn" />
        </div>
        <div class="good_detail_wraper" style="border: none">
          <div class="panel-default" style="border: 1px solid #ddd">
            <div class="panel-heading" style="">
              <h5>注册表单</h5>
            </div>
            <div class="panel-body">
              <table class="table table-loose table-hover">
                <tbody>
                  <tr>
                    <td>横幅图</td>
                    <td>
                      <el-image v-if="registerInfo.pictureUrl" style="width: 160px;" :src="registerInfo.pictureUrl" fit="cover" class="img-thumbnail" />
                      <el-image v-else style="width: 160px;" :src="require('@/assets/vip/vip_register_banner.png')" fit="cover" class="img-thumbnail" />
                    </td>
                  </tr>
                  <tr>
                    <td>注册信息</td>

                    <td class="table-responsive">
                      <el-table :data="fieldsList" class="table-bordered">
                        <el-table-column label="名称">
                          <template slot-scope="scope">
                            <!-- {{ get_custom_fields }} -->
                            {{ scope.row.type === 'fixed' ? getFieldInfo(scope.row.value)['name'] : scope.row.label }}
                          </template>
                        </el-table-column>
                        <el-table-column label="类型">
                          <template slot-scope="scope">
                            {{ scope.row.type === 'fixed' ? getFieldInfo(scope.row.value)['type'] : getFieldInfo(scope.row.kind)['type'] }}
                          </template>
                        </el-table-column>
                        <el-table-column label="选项值">
                          <template slot-scope="scope">
                            {{ scope.row.optionList || '-' }}
                          </template>
                        </el-table-column>
                      </el-table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="panel-heading">
              <h5>注册链接</h5>
            </div>
            <div class="panel-body">
              <table class="table table-loose table-hover">
                <tbody>
                  <tr>
                    <td>注册链接</td>
                    <td class="flex">
                      <div style="width: 50%; margin-right: 10px">
                        <el-input ref="copyUrl" :value="registerInfo.registerUrl" type="textarea" style="opacity: 0;position: absolute; left: 0; top:0; width: 10px;height: 10px;z-index: -1;" :rows="20" resize="none" />
                        <el-input :value="registerInfo.registerUrl" :disabled="true">
                          <el-button slot="append" @click="copyClicked">复制</el-button>
                        </el-input>
                      </div>
                      <el-button @click="viewQrShow('default')">二维码</el-button>
                    </td>
                  </tr>
                  <tr>
                    <td>自动审核</td>
                    <td>{{ registerInfo.autoApprove ? '是' : '否' }}</td>
                  </tr>
                  <tr v-if="vipFuncEnabled">
                    <td>注册等级</td>
                    <td>{{ registerInfo.vipLevelName }}</td>
                  </tr>
                  <tr>
                    <td>注册标签</td>
                    <td>{{ registerInfo.tagName }}</td>
                  </tr>
                </tbody>
              </table>
              <hr>
              <el-button v-if="checkPer(['vip_register_settings_manage'])" type="success" @click="$router.push({ name: 'VipSettingEditRegister' })">编辑</el-button>
            </div>
          </div>
          <div class="panel-default" style="border: 1px solid #ddd; margin-top: 20px;">
            <div class="panel-heading">
              <h5>更多注册链接</h5>
            </div>
            <div class="panel-default">
              <el-table :data="registerLink">
                <el-table-column label="名称" prop="name" />
                <el-table-column label="用户标签" prop="tagName">
                  <template slot-scope="scope">
                    {{ scope.row.tagName || '-' }}
                  </template>
                </el-table-column>
                <el-table-column v-if="vipFuncEnabled" label="会员等级" prop="vipLevelName" />
                <el-table-column label="自动审核" prop="autoApprove">
                  <template slot-scope="scope">
                    {{ scope.row.autoApprove ? '开启' : '关闭' }}
                  </template>
                </el-table-column>
                <el-table-column label="启用状态" prop="enabled">
                  <template slot-scope="scope">
                    {{ scope.row.enabled ? '开启' : '关闭' }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="120px">
                  <template slot-scope="scope">
                    <el-button type="text" @click="viewQrShow(scope.row)">预览</el-button>
                    <span v-if="checkPer(['vip_register_settings_manage'])"> - </span>
                    <el-button v-if="checkPer(['vip_register_settings_manage'])" type="text" @click="editRegisterLink(scope.row)">编辑</el-button>
                    <span v-if="checkPer(['vip_register_settings_manage'])"> - </span>
                    <el-button v-if="checkPer(['vip_register_settings_manage'])" type="text" @click="deleteRegisterLink(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="checkPer(['vip_register_settings_manage'])" style="text-align: center;border: 1px dashed #cccccc;line-height: 40px; margin-top: 20px;">
            <span style="font-size: 14px;color: #666666; cursor: pointer;" @click="registerDialog.show = true">新建注册链接</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="registerDialogCancel"
      :visible.sync="registerDialog.show"
      :title="`${registerDialog.action === 'add' ? '新建' : '修改'}注册链接`"
      width="660px"
    >
      <el-form ref="form" :rules="rules" :model="form" size="small" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="启用状态" prop="enabled">
          <el-switch v-model="form.enabled" />
        </el-form-item>
        <el-form-item label="自动审核" prop="autoApprove">
          <el-switch v-model="form.autoApprove" />
          <p class="help-block">开启后，无需人工审核，用户注册后自动成为会员</p>
        </el-form-item>

        <el-form-item v-if="vipFuncEnabled" label="会员等级" prop="vipLevelId">
          <el-select v-model="form.vipLevelId">
            <el-option v-for="item in vipList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <p class="help-block">注册审核通过后，自动设置为所选会员等级</p>
        </el-form-item>

        <el-form-item label="注册标签" prop="label">
          <el-select v-model="form.tagId" filterable placeholder="请选择">
            <el-option
              v-for="(item, index) in userTags"
              :key="index +'_tags'"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <p class="help-block">自动设置所选标签。 列表中没有想要的标签？点击<a href="/admin/user_tags" target="_blank">新建标签</a></p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="registerDialog.status" type="primary" @click="submit">确认</el-button>
        <el-button @click="registerDialogCancel">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="view_qr.show"
      title="会员注册"
      width="580px"
    >
      <div style="padding: 0px 0 10px; text-align: center;">
        <div style="width: 80%; margin: 0 auto; margin-bottom: 30px;">
          <p>复制链接注册会员</p>
          <el-input ref="copyUrl" :value="view_qr.url" type="textarea" style="opacity: 0;position: absolute; left: 0; top:0; width: 10px;height: 10px;z-index: -1;" :rows="20" resize="none" />
          <el-input :value="view_qr.url" :disabled="true">
            <el-button slot="append" @click="copyClicked">复制</el-button>
          </el-input>
        </div>

        <VueQr ref="Qrcode" :text="view_qr.url" :size="200" :margin="0" />
        <br>
      </div>
      <div style="text-align: center"> <el-button type="text" @click="download_qr_code">下载二维码</el-button> </div>
    </el-dialog>
  </div>
</template>

<script>
const fieldI18n = {
  phone: { name: '手机号', type: '手机号' },
  name: { name: '姓名 ', type: '文字' },
  citizenid: { type: '身份证号' },
  select: { type: '单选' },
  checkboxes: { type: '多选' },
  address: { type: '省市区' },
  picture: { type: '图片' },
  string: { type: '文字' }
}
import VueQr from 'vue-qr'
import point_store from '@/api/point_store'
import custom_form from '@/api/custom_form'
import vip_register_setting from '@/api/vip_register_setting'
import vip_setting from '@/api/vip_setting'
import vip_level from '@/api/vip_level'
import tags from '@/api/tag'
import { mapGetters } from 'vuex'

const defaultForm = {
  name: null,
  enabled: false,
  autoApprove: null,
  vipLevelId: null,
  tagId: null
}
export default {
  components: {
    VueQr
  },
  data() {
    return {
      fieldsList: [],
      registerInfo: {},
      registerLink: [],
      vipList: [],
      userTags: [],
      registerDialog: {
        action: 'add',
        show: false,
        status: false
      },
      tableLoading: true,
      form: Object.assign({}, defaultForm),
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        vipLevelId: [
          { required: true, message: '会员等级不能为空', trigger: 'blur' }
        ]
      },
      view_qr: {
        show: false,
        url: null
      },
      vipFuncEnabled: false
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '会员注册' }
    ])
    custom_form.index({ type: 'CustomForms::Register' }).then(response => {
      this.fieldsList = response.data.fieldsList.map((element, index) => {
        return element.type === 'fixed' ? element : response.data.customFields.find(item => item.id === element.value)
      })
    })
    await point_store.functions().then(response => {
      this.vipFuncEnabled = response.data.vipFuncEnabled
    })
    this.fetch()
    vip_setting.register().then(response => {
      this.registerInfo = response.data
    })
    if (this.vipFuncEnabled) {
      vip_level.list().then(response => {
        this.vipList = response.data
      })
    }
    tags.all({ type: 'UserTag' }).then(response => {
      this.userTags = response.data
    })
  },
  methods: {
    fetch() {
      vip_register_setting.list().then(response => {
        this.registerLink = response.data
      })
    },
    getFieldInfo(key) {
      return fieldI18n[key]
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.registerDialog.status = true
          vip_register_setting[this.registerDialog.action](this.form).then(response => {
            this.registerDialogCancel()
            this.fetch()
          }).catch(_error => {
            this.registerDialog.status = false
            // this.registerDialog.show = false
            // this.registerDialog.action = 'add'
          })
        } else {
          return false
        }
      })
    },
    editRegisterLink(data) {
      this.registerDialog.action = 'edit'
      this.registerDialog.show = true
      this.form = Object.assign({}, data)
    },
    registerDialogCancel() {
      this.registerDialog.status = false
      this.registerDialog.show = false
      this.registerDialog.action = 'add'
      this.form = Object.assign({}, defaultForm)
    },
    deleteRegisterLink(data) {
      if (confirm('确定删除么？')) {
        this.$message.success('删除成功')
        vip_register_setting.del(data).then(response => {
          this.fetch()
        })
      }
    },
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    },
    download_qr_code() {
      const iconUrl = this.$refs['Qrcode'].$el.src
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = `会员注册`
      a.href = iconUrl
      a.dispatchEvent(event)
    },
    viewQrShow(data) {
      if (data === 'default') {
        this.view_qr.show = true
        this.view_qr.url = this.registerInfo.registerUrl
      } else {
        this.view_qr.show = true
        this.view_qr.url = data.registerUrl
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}

.phone-frame {
  margin: 0 auto;
}
::v-deep {
  .table {
    margin-bottom: 0px;
  }
}
.good_detail_wraper {
  width: 45vw;
}
.table-bordered {
  border: 1px solid #DDD;
}
</style>
