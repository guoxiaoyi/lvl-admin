<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li class="active">
        <a href="javascript:void(0)">产品字段设置</a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div v-if="ready && checkPer(['product_fields_edit'])" class="panel-heading">
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
        <el-table-column label="数据类型" prop="kind" width="150px" />
        <el-table-column label="选择项" prop="optionList" />
        <el-table-column label="必填" prop="required" width="80px" />
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

        <el-form-item v-if="['CustomField::Select', 'CustomField::CheckBoxes'].includes(form.type)" label="选择项" prop="optionsStr">
          <el-input v-model="form.optionsStr" type="textarea" :rows="4" />
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
import Sortable from 'sortablejs'

const defaultForm = {
  fieldableType: 'Store',
  hint: null,
  label: null,
  optionsStr: null,
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
      submitting: false,
      fieldI18n: {
        price: { name: '价格', type: '文字' },
        spec: { name: '规格', type: '文字' },
        images: { name: '图片', type: '图片' },
        name: { name: '产品名称', type: '文字' },
        ean_13: { name: '商品条码', type: '文字' },
        code: { name: '产品代码', type: '文字' },
        description: { name: '描述', type: '文字' },
        url: { name: '产品链接', type: '文字' },
        firm: { name: '生产商', type: '文字' },
        address: { name: '地址', type: '文字' },
        origin: { name: '产地', type: '文字' },
        phone: { name: '电话', type: '手机号' }
      },
      origin_fieds: [],
      id: null
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
            type: `CustomForms::Product`,
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
      custom_form.product().then(response => {
        const data = []
        const customFields = response.data.customFields
        this.origin_fieds = response.data.fieldsList
        this.id = response.data.id
        response.data.fieldsList.forEach(f => {
          switch (f.type) {
            case 'fixed': {
              data.push({
                data: f,
                label: (this.current_type.key === 'CustomForms::ChannelWorker' && f.value === 'name') ? '姓名' : this.fieldI18n[f.value]['name'],
                type: { key: 'fixed', label: '固定' },
                kind: this.fieldI18n[f.value]['type'],
                optionList: '-',
                required: '是',
                original: JSON.stringify(f)
              })
              break
            }
            case 'custom': {
              const item = customFields.find(cf => cf.id === parseInt(f.value))
              data.push({
                data: item,
                label: item.label,
                type: { key: 'custom', label: '自定义' },
                kind: { string: '文字', phone: '手机号', select: '单选', checkboxes: '多选', picture: '图片', citizenid: '身份证号' }[item.kind],
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
      this.modal.title = '添加' + this.custom_field_types.find(cft => cft.key === item)['value']
      this.form.context = 'product'
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
<style lang="scss" scoped>
.fa-arrows {
  cursor: move;
}
</style>
