<template>
  <div v-if="readyToRender" class="custom-form">
    {{ form }}
    <component
      :is="getComponentType(field.kind)"
      v-for="(field, index) in formValues"
      :key="field.key"
      :value="field.value"
      :name="getFieldProp(index, field)"
      :label="field.label"
      :options="field.options"
      :placeholder="field.placeholder"
      :required="field.required"
      :edit="edit"
      @input="updateFieldValue(index, $event)"
    />
  </div>
</template>

<script>
import CustomInput from './CustomInput.vue'
import CustomSelect from './CustomSelect.vue'
import CustomCheckboxGroup from './CustomCheckboxGroup.vue'
import CustomUpload from './CustomUpload.vue'

export default {
  name: 'CustomForm',
  components: {
    CustomCheckboxGroup,
    CustomInput,
    CustomUpload,
    CustomSelect
  },
  props: {
    form: {
      type: Array,
      required: true,
      default: () => []
    },
    fields: {
      type: Array,
      required: true
    },
    edit: {
      type: String,
      default: () => {
        return 'edit'
      }
    }
  },
  data() {
    return {
      formValues: [],
      initialized: false, // 状态标记，确保fields先初始化
      readyToRender: false
    }
  },
  watch: {
    fields: {
      handler(newFields) {
        if (newFields.length > 0) {
          this.initializeFormValues(newFields)
        }
      },
      immediate: true,
      deep: true
    },
    form: {
      handler(newForm) {
        if (this.initialized) { // 只有在fields处理后才处理form
          this.applyFormValues(newForm)
        }
      },
      deep: true
    }
  },
  methods: {
    initializeFormValues(fields) {
      this.initialized = true
      const newFieldsList = fields.map(item => {
        const field = {
          kind: item.kind,
          label: item.label,
          customFieldId: item.id,
          required: item.kind === 'picture' ? false : item.required,
          placeholder: item.hint,
          options: item.options,
          ...this.getInitialValue(item.kind)
        }
        return field
      })

      this.formValues = newFieldsList
      this.$nextTick(() => {
        this.applyFormValues(this.form)
      })
    },
    applyFormValues(form) {
      if (form && form.length > 0) {
        form.forEach(item => {
          const f = this.formValues.find(i => i.customFieldId === item.customFieldId)
          if (item.id) {
            f.id = item.id
          }
          if (item.pictureUrl) {
            f.value.pictureId = item.pictureId
            f.value.pictureUrl = item.pictureUrl
          }
          if (item.value) {
            f.value = item.value
            f.createdAt = item.createdAt
            f.updatedAt = item.updatedAt
          }
          // if (idx >= 0) {
          // this.$set(this.formValues, idx, { ...this.formValues[idx], ...p })
          // }
        })
      }
      this.$emit('update:form', this.formValues)
      this.readyToRender = true
    },
    getComponentType(type) {
      return { string: 'CustomInput', select: 'CustomSelect', checkboxes: 'CustomCheckboxGroup', picture: 'CustomUpload' }[type] || 'CustomInput'
    },
    getInitialValue(kind) {
      return { checkboxes: { value: [] }, picture: { value: { pictureId: null, pictureUrl: null }}}[kind] || { value: null }
    },
    getFieldProp(index, field) {
      return field.kind === 'picture' ? `customFieldValues.${index}.pictureId` : `customFieldValues.${index}.value`
    },
    updateFieldValue(index, value) {
      this.$set(this.formValues, index, { ...this.formValues[index], value })
    },
    getProcessedData() {
      const datas = JSON.parse(JSON.stringify(this.formValues))
      const formData = []
      datas.forEach(item => {
        const { id, customFieldId, value, kind } = item
        const obj = { customFieldId }
        obj.customFieldId = item.customFieldId
        if (id) {
          obj.id = id
        }
        switch (kind) {
          case 'checkboxes':
            obj.value = JSON.stringify(value)
            break
          case 'picture':
            obj.pictureId = value.pictureId
            break
          default:
            obj.value = value
            break
        }
        formData.push(obj)
      })
      return formData
    }
  }
}
</script>
