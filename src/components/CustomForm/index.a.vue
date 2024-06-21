<template>
  <div class="custom-form">
    <component
      :is="getComponentType(field.kind)"
      v-for="(field, index) in fieldsList"
      :key="field.key"
      :value="field.value"
      :name="getFieldProp(index, field)"
      :label="field.label"
      :options="field.options"
      :placeholder="field.placeholder"
      :required="field.required"
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
    value: {
      type: Array,
      required: true,
      default: () => []
    },
    fields: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      fieldsList: [],
      status: 0
    }
  },
  watch: {
    value: {
      handler(newValue) {
        if (this.status > 0) {
          return
        }
        const newFieldsList = [...this.fieldsList]
        newValue.forEach(item => {
          this.updateFieldsFromModel(item, newFieldsList)
        })
        this.fieldsList = newFieldsList
      },
      deep: true,
      immediate: true
    },
    fields: {
      handler(newValue) {
        if (this.status > 0) {
          return
        }
        const newFieldsList = newValue.map(item => {
          const field = {
            kind: item.kind,
            label: item.label,
            customFieldId: item.id,
            required: item.kind === 'picture' ? false : item.required,
            placeholder: item.hint,
            options: item.options,
            ...this.getInitialValue(item.kind)
          }
          return this.updateFieldsFromValue(item, field)
        })
        this.fieldsList = newFieldsList
        if (this.value.length === 0) {
          this.$emit('input', newFieldsList)
        }
      },
      immediate: true
    }
  },
  methods: {
    getInitialValue(kind) {
      switch (kind) {
        case 'checkboxes':
          return { value: [] }
        case 'picture':
          return { value: { pictureId: null, pictureUrl: null }}
        default:
          return { value: null }
      }
    },
    updateFieldsFromValue(newValue, field) {
      const a = JSON.parse(JSON.stringify(field))
      const copyField = { ...a }
      const valueField = this.value.find(i => i.customFieldId === newValue.id)
      if (field.kind === 'picture') {
        copyField.value = { pictureId: null, pictureUrl: null }
        copyField.pictureId = null
        copyField.pictureUrl = null
      }

      if (valueField) {
        copyField.id = valueField.id
        if (field.kind === 'picture') {
          copyField.value = {
            pictureId: valueField.pictureId,
            pictureUrl: valueField.pictureUrl
          }
          copyField.pictureId = valueField.pictureId
          copyField.pictureUrl = valueField.pictureUrl
        } else {
          copyField.value = valueField.value
        }
      }
      return copyField
    },
    updateFieldsFromModel(field, fieldsList) {
      const updateField = fieldsList.find(i => i.customFieldId === field.customFieldId)
      if (updateField) {
        updateField.id = field.id
        if (field.kind === 'picture') {
          updateField.value = {
            pictureId: field.pictureId,
            pictureUrl: field.pictureUrl
          }
        } else {
          updateField.value = field.value
        }
      }
    },
    getFieldProp(index, field) {
      return field.kind === 'picture' ? `customFieldValues.${index}.pictureId` : `customFieldValues.${index}.value`
    },
    getComponentType(type) {
      switch (type) {
        case 'string':
          return 'CustomInput'
        case 'select':
          return 'CustomSelect'
        case 'checkboxes':
          return 'CustomCheckboxGroup'
        case 'picture':
          return 'CustomUpload'
        default:
          return 'CustomInput'
      }
    },
    updateFieldValue(index, value) {
      console.log('updateFieldValue', value)
      this.status = 1
      this.fieldsList[index].value = value
      this.$emit('input', this.fieldsList)
    },
    getProcessedData() {
      const datas = JSON.parse(JSON.stringify(this.fieldsList))
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
