<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 会员注册 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="registerForm">
          <h5>注册表单</h5>
          <hr>
          <el-form-item label="横幅图">
            <div class="flex" style="align-items: center;">
              <el-image v-if="registerForm.pictureUrl" style="width: 160px;" :src="registerForm.pictureUrl" fit="cover" class="img-thumbnail" />
              <el-image v-else style="width: 160px;" :src="require('@/assets/vip/vip_register_banner.png')" fit="cover" class="img-thumbnail" />
              <div v-if="checkPer(['vip_register_settings_manage'])" style="margin-left: 30px">
                <el-button type="text" :loading="reseting" @click="reset"><i class="fa fa-refresh" /> 还原</el-button>
              </div>
            </div>
            <el-upload
              v-if="checkPer(['vip_register_settings_manage'])"
              action="#"
              accept="image/*"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
              :before-upload="beforeImageUpload"
            >
              <el-button type="success" size="medium" :loading="uploading">点击上传</el-button>
            </el-upload>
            <div class="help-block">图片不能超过2M，尺寸：750x480px，格式：png，jpg，gif</div>
          </el-form-item>
          <el-form-item label="注册信息" class="custom-field-container">
            <div class="panel panel-default">
              <div v-if="checkPer(['vip_register_settings_manage'])" class="panel-heading">
                添加注册字段：
                <el-button
                  v-for="(item, index) in custom_field_types"
                  :key="index + 'cf'"
                  size="mini"
                  type="success"
                  @click="add(item)"
                >
                  {{ item.name }}
                </el-button>
              </div>
              <el-table :data="fields">
                <el-table-column label="表单排序" width="80px" align="center"><i class="fa fa-arrows" /></el-table-column>
                <el-table-column label="字段名称" prop="label" width="150px" />
                <el-table-column label="字段属性" prop="type.label" />
                <el-table-column label="字段类型" prop="kind" />
                <el-table-column label="选择项" prop="optionList" />
                <el-table-column label="必填" prop="required" />
                <el-table-column label="操作" width="150px">
                  <template slot-scope="scope">
                    <div v-if="scope.row.type.key === 'custom'">
                      <span><el-button type="text" @click="edit(scope.row.data)">编辑</el-button></span>
                      -
                      <span><el-button type="text" @click="del(scope.row.data)">删除</el-button></span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <h5>注册链接</h5>
          <hr>
          <el-form-item label="注册自动审核">
            <el-switch v-model="registerForm.autoApprove" />
            <p class="help-block">开启后，无需人工审核，用户注册后自动成为会员</p>
          </el-form-item>
          <el-form-item v-if="vipFuncEnabled" label="会员等级">
            <el-select v-model="registerForm.vipLevelId" placeholder="请选择" filterable>
              <el-option
                v-for="item in vipLevels"
                :key="item.id+'levels'"
                :label="item.label"
                :value="item.id"
              />
            </el-select>

            <p class="help-block">注册审核通过后，自动设置为所选会员等级</p>
          </el-form-item>
          <el-form-item label="注册标签">
            <el-select v-model="registerForm.tagId" filterable placeholder="请选择">
              <el-option
                v-for="(item, index) in userTags"
                :key="index +'_tags'"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <p class="help-block">自动设置所选标签。 列表中没有想要的标签？<a target="_blank" href="/admin/user_tags">点击新建标签</a></p>
          </el-form-item>
          <hr>
          <el-button type="success" :loading="registerSubmitting" @click="save">保存</el-button>
        </el-form>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.show"
      :title="modal.title"
      width="580px"
    >

      <el-form ref="form" size="small" label-width="16.666%" :model="form">
        <el-form-item label="数据名称" prop="label">
          <el-input v-model="form.label" />
          <p class="help-block">最多60个字符，如：电话，性别</p>
        </el-form-item>

        <el-form-item label="必填" prop="required">
          <el-switch v-model="form.required" active-color="#449d44" inactive-color="#e6e6e6" />
        </el-form-item>

        <el-form-item v-if="['CustomField::Select', 'CustomField::CheckBoxes'].includes(form.type)" label="选择项" prop="options">
          <el-input v-model="form.options" type="textarea" :rows="4" />
          <p class="help-block">选择项，一行一个选项</p>
        </el-form-item>

        <el-form-item label="提示说明" prop="hint">
          <el-input v-model="form.hint" />
          <p class="help-block">显示在表单下方，长度在2~50字符之间，可以为空</p>
        </el-form-item>
      </el-form>

      <div v-if="checkPer(['vip_register_settings_manage'])" slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitting" @click="submit">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vip_setting from '@/api/vip_setting'
import vip_level from '@/api/vip_level'
import tags from '@/api/tag'
import custom_form from '@/api/custom_form'
import custom_field from '@/api/custom_field'
import amazon from '@/api/amazon'
import point_store from '@/api/point_store'

import Sortable from 'sortablejs'

const fieldI18n = {
  phone: { name: '手机号', type: '手机号' },
  name: { name: '姓名 ', type: '文字' },
  citizenid: { type: '身份证号' },
  select: { type: '单选' },
  checkboxes: { type: '多选' },
  address: { type: '省市区' },
  picture: { type: '图片' }
}
const defaultForm = {
  fieldableType: 'Store',
  hint: null,
  label: null,
  options: null,
  required: false
}

export default {
  data() {
    return {
      vipFuncEnabled: false,
      registerSubmitting: false,
      vipLevels: [],
      userTags: [],
      custom_field_types: [
        { key: 'CustomField::CitizenId', name: '身份证号' },
        { key: 'CustomField::String', name: '文字' },
        { key: 'CustomField::Select', name: '单选' },
        { key: 'CustomField::CheckBoxes', name: '多选' },
        { key: 'CustomField::Picture', name: '图片' },
        { key: 'CustomField::Address', name: '省市区' }
      ],
      registerInfo: {},
      registerForm: {
        autoApprove: false,
        tagId: null,
        pictureId: null,
        vipLevelId: null
      },
      rules: {

      },
      form: Object.assign({}, defaultForm),
      fields: [],
      fieldI18n,
      submitting: false,
      uploading: false,
      modal: {
        title: '',
        show: false
      },
      origin_fieds: [],
      id: null,
      reseting: false
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '会员注册' }
    ])
    await point_store.functions().then(response => {
      this.vipFuncEnabled = response.data.vipFuncEnabled
    })

    vip_setting.register().then(response => {
      this.registerForm.autoApprove = response.data.autoApprove
      this.registerForm.tagId = response.data.tagId
      this.registerForm.pictureId = response.data.pictureId
      this.registerForm.vipLevelId = response.data.vipLevelId
      this.registerForm.pictureUrl = response.data.pictureUrl
    })
    if (this.vipFuncEnabled) {
      vip_level.list().then(response => {
        this.vipLevels = response.data
      })
    }
    tags.all({ type: 'UserTag' }).then(response => {
      this.userTags = response.data
    })
    this.fetch_custom_form()

    this.$nextTick(() => {
      const _this = this
      const tbody = document.querySelector('.el-table__body tbody')
      Sortable.create(tbody, {
        handle: '.fa-arrows',
        onEnd({ newIndex, oldIndex }) {
          const touch_data = _this.origin_fieds[oldIndex]
          const data = _this.origin_fieds
          data.splice(oldIndex, 1)
          data.splice(newIndex, 0, touch_data)
          custom_form.edit({
            id: _this.id,
            type: `CustomForms::Register`,
            fieldsList: data
          }).then(response => {
            _this.$message({
              message: '排序成功',
              type: 'success'
            })
          })
        }
      })
    })
  },
  methods: {
    fetch_custom_form() {
      custom_form.index({ type: `CustomForms::Register` }).then(response => {
        const data = []
        const customFields = response.data.customFields
        this.origin_fieds = response.data.fieldsList
        this.id = response.data.id
        response.data.fieldsList.forEach(f => {
          switch (f.type) {
            case 'fixed': {
              data.push({
                data: f,
                label: this.fieldI18n[f.value]['name'],
                type: { key: 'fixed', label: '固定' },
                kind: this.fieldI18n[f.value]['type'],
                optionList: '-',
                required: '是',
                original: JSON.stringify(f)
              })
              break
            }
            case 'custom': {
              const item = customFields.find(cf => cf.id === f.value)

              data.push({
                data: item,
                label: item.label,
                type: { key: 'custom', label: '自定义' },
                kind: { string: '文字', phone: '手机号', select: '单选', checkboxes: '多选', picture: '图片', citizenid: '身份证号', address: '省市区' }[item.kind],
                optionList: item.optionList ? item.optionList.join(',') : '-',
                required: item.required ? '是' : '否',
                original: JSON.stringify(f)
              })
              break
            }
          }
        })
        this.fields = data
      })
    },
    getCustomField(item) {
      this.current_type = item
    },
    edit(data) {
      this.modal.show = true
      this.modal.title = '编辑' + this.custom_field_types.find(cft => cft.key === data.type)['name']
      this.form.id = data.id
      this.form.context = data.context
      this.form.type = data.type
      this.form.hint = data.hint
      this.form.label = data.label
      this.form.options = data.optionList ? data.optionList.join('\n') : ''
      this.form.required = data.required
    },
    add(item) {
      this.modal.title = '添加' + this.custom_field_types.find(cft => cft.key === item.key)['name']
      this.form.context = 'register'
      this.form.type = item.key
      this.modal.show = true
    },
    submit() {
      this.submitting = true
      console.log(this.form)
      if (this.form.id) {
        custom_field.edit(this.form).then(response => {
          this.fetch_custom_form()
          this.cancel()
        }).catch(() => {
          this.submitting = false
        })
      } else {
        custom_field.add(this.form).then(response => {
          this.fetch_custom_form()
          this.cancel()
        }).catch(() => {
          this.submitting = false
        })
      }
    },
    cancel() {
      this.form = Object.assign({}, defaultForm)
      this.modal = { title: '', show: false }
      this.submitting = false
    },
    del(data) {
      if (confirm('确认删除吗?')) {
        custom_field.del(data).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetch_custom_form()
        })
      }
    },
    save() {
      this.registerSubmitting = true
      vip_setting.edit(this.registerForm).then(response => {
        this.$message.success('保存成功')
        this.registerSubmitting = false
        setTimeout(() => {
          this.$router.push({ name: 'VipSettingEdit' })
        }, 1000)
      }).catch(fail => {
        this.registerSubmitting = false
      })
      console.log(this.registerForm)
    },
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

      // params.data.picture_list = []
      amazon.tmp(formData).then(response => {
        this.registerForm.pictureId = response.data.id
        this.registerForm.pictureUrl = response.data.imageUrl
        this.uploading = false
      }).catch(() => {
        this.uploading = false
      })
    },
    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('横幅图大小不能超过 2MB!')
      }
      this.uploading = false
      return isLt2M
    },
    reset() {
      if (confirm('确定吗?')) {
        this.reseting = true
        vip_setting.reset_banners().then(response => {
          this.reseting = false
          window.location.reload()
        })
      }
    }
  }

}
</script>

<style lang="scss" scoped>

::v-deep {
  .custom-field-container {
    .el-form-item__content {
      min-width: 750px;
    }
  }
}

</style>
