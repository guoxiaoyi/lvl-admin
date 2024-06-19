<script>
import custom_form from '@/api/v2_custom_form'
import products from './productsField.js'

const types = {
  products
}

export default {
  props: {
    type: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      fields: {
        properties: [],
        form: {
          customFieldValues: []
        },
        checkboxes: [],
        pictures: []
      },
      customFields: []
    }
  },
  mounted() {
    custom_form.index({ type: this.type }).then(({ data }) => {
      const { fieldsList, customFields } = data
      this.customFields = customFields
      this.initializeForm(fieldsList)
    })
  },
  methods: {
    initializeForm(fieldsList) {
      const form = { customFieldValues: [] }

      fieldsList.forEach(element => {
        const currentField = {
          type: element.type,
          kind: this.getFieldData(element, 'kind'),
          label: this.getFieldData(element, 'label'),
          key: element.type === 'fixed' ? element.value : `custom_field_${element.value}`,
          required: this.getFieldData(element, 'required'),
          placeholder: this.getFieldData(element, 'hint'),
          options: this.getFieldData(element, 'options')
        }
        this.fields.properties.push(currentField)

        if (element.type === 'fixed') {
          form[element.value] = null
        } else {
          const value = {
            customFieldId: element.value,
            value: this.getInitialValue(currentField.kind)
          }
          form.customFieldValues.push(value)
        }
      })
      this.$set(this.fields, 'form', form)
    },
    getFieldData(field, kind) {
      if (this.type === 'CustomForms::Product') {
        if (field.type === 'fixed') {
          return types.products[field.value][kind]
        }
        if (field.type === 'custom') {
          return this.findCustomField(field.value)[kind]
        }
      }
      return ''
    },
    findCustomField(id) {
      return this.customFields.find(i => i.id === id)
    },
    findCustomFieldInFormIndex(key) {
      const id = key.split('_')[2]
      return this.fields.form.customFieldValues.findIndex(i => i.customFieldId === parseInt(id))
    },
    getInitialValue(kind) {
      if (['checkboxes'].includes(kind)) {
        return []
      }
      return null
    },
    renderField(h, item, model) {
      const valueKey = item.type === 'fixed' ? item.key : 'value'
      if (item.kind === 'string') {
        return h('el-input', {
          props: {
            value: model[valueKey],
            placeholder: item.placeholder
          },
          on: {
            input: (val) => { model[valueKey] = val }
          }
        })
      } else if (item.kind === 'select') {
        return h('el-select', {
          props: {
            value: model[valueKey],
            placeholder: item.placeholder,
            clearable: true
          },
          on: {
            input: (val) => { model[valueKey] = val }
          }
        }, item.options.map(option => h('el-option', {
          props: {
            label: option,
            value: option
          }
        })))
      } else if (item.kind === 'checkboxes') {
        return h('el-checkbox-group', {
          props: {
            value: model[valueKey]
          },
          on: {
            input: (val) => { model[valueKey] = val }
          }
        }, item.options.map(option => h('el-checkbox', {
          props: {
            label: option,
            value: option
          }
        })))
      }
      return null
    },
    submit() {
      console.log(this.fields)
      console.log(this.fields.form)
    }
  },
  render(h) {
    return h('el-form', {
      ref: 'form',
      props: {
        size: 'small',
        labelWidth: '16.6666%',
        model: this.fields.form
      }
    }, [
      ...this.fields.properties.map(item => {
        const model = item.type === 'fixed' ? this.fields.form : this.fields.form.customFieldValues[this.findCustomFieldInFormIndex(item.key)]
        return h('el-form-item', {
          props: {
            label: item.label,
            prop: item.type === 'fixed' ? item.key : `customFieldValues.${this.findCustomFieldInFormIndex(item.key)}.value`
          }
        }, [
          this.renderField(h, item, model),
          h('p', { class: 'help-block' }, item.placeholder)
        ])
      }),
      h('hr'),
      h('el-button', {
        props: {
          type: 'success'
        },
        on: {
          click: this.submit
        }
      }, '保存')
    ])
  }
}
</script>
