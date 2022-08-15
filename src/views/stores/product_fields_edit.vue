<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li class="active">
        <a href="javascript:void(0)">产品字段设置</a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div v-if="ready" class="panel-heading">
        添加{{ current_type.value }}字段:
        <el-button
          v-for="(item, index) in ['CustomField::String', 'CustomField::Select', 'CustomField::CheckBoxes', 'CustomField::Picture']"
          :key="index + 'cf'"
          size="mini"
          type="success"
          @click="add(item)"
        >
          {{ custom_field_types.find(cft => cft.key === item)['value'] }}
        </el-button>
      </div>
      <el-table :data="fields">
        <el-table-column label="表单排序" width="80px" align="center"><i class="fa fa-arrows" /></el-table-column>
        <el-table-column label="数据名称" prop="label" />
        <el-table-column label="数据类型" width="150px">
          <template slot-scope="scope">
            {{ scope.row.kind | kind_text }}
          </template>
        </el-table-column>
        <el-table-column label="选择项" prop="optionList">
          <template slot-scope="scope">
            {{ scope.row.optionList | option_list }}
          </template>
        </el-table-column>
        <el-table-column label="必填" width="80px">
          <template slot-scope="scope">
            {{ scope.row.required ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <span><el-button type="text" @click="edit(scope.row)">编辑</el-button></span>
            -
            <span><el-button type="text" @click="del(scope.row)">删除</el-button></span>
          </template>
        </el-table-column>
      </el-table>
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

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitting" @click="submit">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import custom_field from '@/api/custom_field'
import custom_form from '@/api/custom_form'

const defaultForm = {
  fieldableType: 'Store',
  hint: null,
  label: null,
  options: null,
  required: false
}

export default {
  filters: {
    kind_text(value) {
      return { string: '文字', phone: '手机号', select: '单选', checkboxes: '多选', picture: '图片', citizenid: '身份证号' }[value]
    },
    option_list(value) {
      return (value ? value.join(',') : '-')
    }
  },
  data() {
    return {
      ready: false,
      current_type: {},
      custom_field_types: [],

      fields: [],
      form: Object.assign({}, defaultForm),
      modal: {
        title: '',
        show: false
      },
      submitting: false
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '产品字段设置' }
    ])

    await custom_field.type().then(response => {
      this.custom_field_types = response.data
    })
    this.fetch_custom_form()
    this.ready = true
  },
  methods: {
    fetch_custom_form() {
      custom_form.t_unit_batch().then(response => {
        this.fields = response.data
      })
    },
    edit(data) {
      this.modal.show = true
      this.modal.title = '编辑' + this.custom_field_types.find(cft => cft.key === data.type)['value']
      this.form.id = data.id
      this.form.context = data.context
      this.form.type = data.type
      this.form.hint = data.hint
      this.form.label = data.label
      this.form.options = data.optionList ? data.optionList.join('\n') : ''
      this.form.required = data.required
    },
    add(item) {
      console.log(this.custom_field_types.find(cft => cft.key === item))
      this.modal.title = '添加' + this.custom_field_types.find(cft => cft.key === item)['value']
      this.form.context = 't_unit_batch'
      this.form.type = item
      this.modal.show = true
    },
    submit() {
      this.submitting = true
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
    }
  }
}
</script>

<style>
</style>
