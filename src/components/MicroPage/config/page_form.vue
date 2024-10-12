<template>
  <div>
    <el-form ref="form" label-width="85px">
      <el-button v-for="item in custom_field_types" :key="item.key" size="mini" type="success" @click="addCustomField(item)">{{ item.name }}</el-button>
      <div class="panel panel-default" style="margin-top: 10px;">
        <el-table :data="values.data.customForm">
          <el-table-column label="数据名称" prop="label" />
          <el-table-column label="数据类型" prop="type">
            <template slot-scope="scope">
              {{ scope.row.type | customType }}
            </template>
          </el-table-column>
          <el-table-column label="选择项" prop="optionsStr" />
          <el-table-column label="必填" prop="required" width="50px">
            <template slot-scope="scope">
              {{ scope.row.required ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editCustomField(scope.row, scope.$index)">编辑</el-button>
              <el-button type="text" @click="delCustomField(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelCustomField"
      :visible="modal.status > 0"
      :title="modal.title"
      width="580px"
    >
      <div v-if="customForm.type === 'CustomField::PhoneCode'" class="alert alert-info" role="alert">
        开启手机号收集，会发送短信验证码验证手机号的真实性。<br>
        请确认您有充足的短信额度，当短信额度不足时，用户将无法收到短信验证码。<br>
        <router-link :to="{ name: 'StoreShow'}" target="_blank">点击查看短信额度</router-link>
      </div>
      <el-form ref="customForm" size="small" label-width="16.666%" :model="customForm">
        <el-form-item label="数据名称" prop="label" :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change']}">
          <el-input
            v-model="customForm.label"
            maxlength="60"
            :disabled="['CustomField::Name', 'CustomField::Phone', 'CustomField::PhoneCode', 'CustomField::CitizenId'].includes(customForm.type)"
          />
          <p class="help-block">最多60个字符，如：电话，性别</p>
        </el-form-item>

        <el-form-item v-if="customForm.type !== 'CustomField::PhoneCode'" label="必填" prop="required">
          <el-switch v-model="customForm.required" active-color="#449d44" inactive-color="#e6e6e6" />
        </el-form-item>

        <el-form-item v-if="['CustomField::Select', 'CustomField::CheckBoxes'].includes(customForm.type)" label="选择项" prop="optionsStr" :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change']}">
          <el-input v-model="customForm.optionsStr" type="textarea" :rows="4" />
          <p class="help-block">选择项，一行一个选项</p>
        </el-form-item>

        <el-form-item label="提示说明" prop="hint">
          <el-input v-model="customForm.hint" />
          <p class="help-block">显示在表单下方，长度在2~50字符之间，可以为空</p>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="modal.status > 1" @click="createCustomField">确认</el-button>
        <el-button @click="modal.status = 0">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const custom_field_types = [
  { key: 'CustomField::Name', name: '姓名' },
  { key: 'CustomField::Phone', name: '手机号' },
  { key: 'CustomField::PhoneCode', name: '手机号(验证码)' },
  { key: 'CustomField::CitizenId', name: '身份证号' },
  { key: 'CustomField::String', name: '文字' },
  { key: 'CustomField::Select', name: '单选' },
  { key: 'CustomField::Picture', name: '图片' },
  { key: 'CustomField::Camera', name: '拍照' },
  { key: 'CustomField::CheckBoxes', name: '多选' },
  { key: 'CustomField::Gender', name: '性别' }
]
export default {
  filters: {
    customType(type) {
      return custom_field_types.find(i => i.key === type)['name']
    }
  },
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      action: 'add',
      dataIndex: null,
      show: false,
      custom_field_types,
      customForm: {
        fieldableType: 'Activity',
        fieldableId: parseInt(this.$route.params.id),
        context: 'activity',
        hint: null,
        label: null,
        optionsStr: null,
        required: false
      },
      datas: [],
      modal: {
        status: 0
      }
    }
  },
  methods: {
    addCustomField(data) {
      this.action = 'add'
      this.modal.status = 1
      this.$refs.customForm && this.$refs.customForm.resetFields()
      this.modal.title = `添加${data.name}`
      this.customForm.fieldableType = 'Activity'
      this.customForm.fieldableId = parseInt(this.$route.params.id)
      this.customForm.context = 'activity'
      this.customForm.hint = null
      this.customForm.label = null
      this.customForm.optionsStr = null
      this.customForm.required = false
      this.customForm.type = data.key
      delete this.customForm.id
      if (data.key === 'CustomField::PhoneCode') {
        this.customForm.required = true
      }
      this.customForm.label =
        ['CustomField::Name', 'CustomField::Phone', 'CustomField::PhoneCode', 'CustomField::CitizenId'].includes(data.key)
          ? (data.key === 'CustomField::PhoneCode' ? '手机号' : data.name) : null
    },
    cancelCustomField() {
      this.modal.status = 0
      this.action = 'add'
      this.dataIndex = null
      this.$refs.customForm.resetFields()
    },
    createCustomField() {
      this.$refs.customForm.validate(valid => {
        if (valid) {
          this.modal.status = 2
          if (this.action === 'add') {
            this.values.data.customForm.push(JSON.parse(JSON.stringify(this.customForm)))
          } else {
            this.$set(this.values.data.customForm, this.dataIndex, JSON.parse(JSON.stringify(this.customForm)))
          }
          this.cancelCustomField()
          // this.modal.status = 1
          // custom_field[action](this.customForm).then(response => {
          //   this.getCustomField()
          //   this.cancelCustomField()
          // }).catch(() => {
          //   this.modal.status = 1
          // })
        }
      })
    },
    editCustomField(data, index) {
      this.action = 'edit'
      this.dataIndex = index
      this.customForm = Object.assign({}, data)
      this.modal.status = 1
      this.modal.title = `编辑${this.custom_field_types.find(item => item.key === data.type).name}`
    },
    delCustomField(data, index) {
      if (confirm('确定删除么？')) {
        this.values.data.customForm.splice(index, 1)
      }
    }
  }
}
</script>

<style>

</style>
