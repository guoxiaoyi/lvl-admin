<script>
import editorImage from '@/components/Tinymce/components/CustomUploadImage'
import custom_form from '@/api/v2_custom_form'
import products from './productsField.js'
import amazon from '@/api/amazon'

const types = {
  products
}

export default {
  components: {
    editorImage
  },
  props: {
    type: {
      type: String,
      default: null
    },
    status: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
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
  watch: {
    value: {
      handler(newVal) {
        this.initializeFormData(newVal)
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {
    await custom_form.index({ type: this.type }).then(({ data }) => {
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
          key: this.getFieldKey(element),
          required: this.getFieldData(element, 'required') || false,
          placeholder: this.getFieldData(element, 'hint'),
          options: this.getFieldData(element, 'options')
        }
        this.fields.properties.push(currentField)

        if (element.type === 'fixed') {
          switch (currentField.kind) {
            case 'images':
              form[currentField.key] = []
              break
            default:
              form[currentField.key] = null
              break
          }
        } else {
          const value = {
            id: null,
            customFieldId: element.value,
            value: this.getInitialValue(currentField)
          }
          if (currentField.kind === 'picture') {
            value.pictureUrl = null
            value.loading = false
            value.pictureId = null
          }
          form.customFieldValues.push(value)
        }
      })

      // 合并初始表单数据和传入的表单数据，确保结构完整
      this.fields.form = {
        ...form,
        ...this.fields.form,
        customFieldValues: this.mergeCustomFieldValues(form.customFieldValues, this.fields.form.customFieldValues)
      }
      // this.$set(this.fields, 'form', form)
    },
    mergeCustomFieldValues(initialValues, currentValues) {
      return initialValues.map(initial => {
        const existing = currentValues.find(item => item.customFieldId === initial.customFieldId)
        return existing ? { ...initial, ...existing } : initial
      })
    },
    initializeFormData(newVal) {
      this.fields.form = { ...newVal }
      if (!this.fields.form.customFieldValues) {
        this.$set(this.fields.form, 'customFieldValues', [])
      }
    },
    getFieldData(field, kind) {
      if (this.type === 'CustomForms::Product') {
        if (field.type === 'fixed') {
          return types.products[field.value][kind]
        }
        if (field.type === 'custom') {
          const f = this.findCustomField(field.value)
          return kind === 'required'
            ? f.kind === 'picture' ? false : f[kind]
            : f[kind]
        }
      }
      return ''
    },
    getFieldKey(field) {
      // element.type === 'fixed' ? element.value : `custom_field_${element.value}`,
      if (this.type === 'CustomForms::Product') {
        if (field.type === 'fixed') {
          return types.products[field.value]['key'] ? types.products[field.value]['key'] : field.value
        }
        if (field.type === 'custom') {
          return `custom_field_${field.value}`
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
    getInitialValue(field) {
      const id = field.key.split('_')[2]
      if (['checkboxes'].includes(field.kind)) {
        this.fields.checkboxes.push(parseInt(id))
        return []
      }
      if (['picture'].includes(field.kind)) {
        this.fields.pictures.push(parseInt(id))
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
      } else if (item.kind === 'picture') {
        const uploadField = this.fields.form.customFieldValues[this.findCustomFieldInFormIndex(item.key)]
        const url = uploadField.pictureUrl
        const imageElement = url
          ? h('el-image', {
            class: 'img-thumbnail activity-thumbnail-middle',
            attrs: {
              fit: 'cover',
              src: url,
              'preview-src-list': [url]
            },
            style: { width: '120px' }
          })
          : null

        const uploadButton = h('el-button', {
          props: {
            loading: uploadField.loading,
            type: 'success',
            size: 'medium'
          }
        }, '上传')

        const uploadElement = h('el-upload', {
          attrs: {
            action: '#',
            accept: 'image/*'
          },
          props: {
            httpRequest: this.upload,
            accept: 'image/*',
            data: { column: this.findCustomFieldInFormIndex(item.key) },
            'show-file-list': false
          }
        }, [uploadButton])

        return [imageElement, uploadElement]
      } else if (item.kind === 'images') {
        const imageUploadBtn = h('editorImage', {
          props: {
            type: 'success'
          },
          on: {
            successCBK: (val) => {
              model[valueKey].unshift(val)
            }
          }
        })
        const imageList = h('div', { style: { display: 'flex', flexWrap: 'wrap' }},
          this.fields.form[item.key].map((image, index) =>
            h('el-card', {
              key: index,
              class: 'slide-image',
              attrs: {
                shadow: 'always',
                bodyStyle: { padding: '0px', display: 'flex' }
              }
            }, [
              h('div', {
                class: 'delete-item',
                on: {
                  click: () => {
                    this.fields.form[item.key] = this.fields.form[item.key].filter(item => item.id !== image.id)
                  }
                }
              }, [
                h('i', { class: 'el-icon-delete-solid' })
              ]),
              h('el-image', {
                class: 'image-item',
                attrs: { src: image.url, fit: 'cover' }
              })
            ])
          )
        )
        return [imageList, imageUploadBtn]
      }
      // <editorImage type="success" @successCBK="setSlideImage" />
      return null
    },
    submit() {
      const form = JSON.parse(JSON.stringify(this.fields.form))
      this.fields.pictures.forEach(id => {
        const a = form.customFieldValues.find(i => i.customFieldId === id)
        a.pictureId = a.value
      })
      this.fields.checkboxes.forEach(id => {
        const a = form.customFieldValues.find(i => i.customFieldId === id)
        a.value = JSON.stringify(a.value)
      })

      if (Object.keys(form).includes('imageList')) {
        form.imageIds = form.imageList.map(img => img.id)
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', form)
        }
      })
    },
    upload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      const filed = this.fields.form.customFieldValues[params.data.column]
      filed.loading = true

      amazon.tmp(formData).then(({ data }) => {
        filed.value = data.id
        filed.pictureUrl = data.imageUrl
        filed.loading = false
      }).catch(() => {
        filed.loading = false
      })
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
            prop: item.type === 'fixed' ? item.key : `customFieldValues.${this.findCustomFieldInFormIndex(item.key)}.value`,
            rules: { required: item.required, message: `${item.label}不能为空`, trigger: 'blur' }
          }
        }, [
          this.renderField(h, item, model),
          h('p', { class: 'help-block' }, item.placeholder)
        ])
      }),
      h('hr'),
      h('el-button', {
        props: {
          type: 'success',
          loading: this.status
        },
        on: {
          click: this.submit
        }
      }, '保存')
    ])
  }
}
</script>
<style scoped lang="scss">
  .avatar-thumbnail-middle {
    width: 120px;
    height: 120px;
  }
  .img-thumbnail {
    padding: 4px;
    line-height: 1.428571429;
    background-color: #FBFBFB;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
    display: inline-block;
    max-width: 100%;
    height:auto
  }
  .slide-image {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: visible;
    margin-bottom: 20px;
    .delete-item {
      width: 20px;
      height: 20px;
      position: absolute;
      top: -10px;
      right: -10px;
      z-index: 4;
      color: #FFF;
      background: red;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 12px;
      cursor: pointer;
    }
    .image-item {
      width: 100px;
      height: 100px;
    }
  }
  ::v-deep {
    .el-card + .el-card {
      margin-top: 0;
    }
    .el-card {
      margin-right: 15px;
    }
  }
</style>
