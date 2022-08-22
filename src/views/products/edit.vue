<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 新建产品 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form v-if="!loading" ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <div v-for="item in fieldsList" :key="item.value" :label="item.value">
            <el-form-item v-if="item.type === 'fixed' && item.value === 'price'" label="价格">
              <el-input v-model="form.price">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'images'" label="图片">
              <editorImage type="primary" @successCBK="setSlideImage" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'spec'" label="规格">
              <el-input v-model="form.spec" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'name'" label="产品名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'ean13'" label="商品条码">
              <el-input v-model="form.ean13" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'description'" label="描述">
              <el-input v-model="form.description" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'url'" label="产品链接">
              <el-input v-model="form.url" type="textarea" />
              <p class="help-block">为产品的展示或者购买页面，如果没有可不填（链接格式如:'http://www.lifanli.cn'）</p>
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'firm'" label="生产商">
              <el-input v-model="form.firm" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'address'" label="地址">
              <el-input v-model="form.address" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'origin'" label="产地">
              <el-input v-model="form.origin" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'phone'" label="电话">
              <el-input v-model="form.phone" />
            </el-form-item>
          </div>
          <div v-for="(cfv, index) in form.customFieldValues" :key="index+'custom'">
            <el-form-item
              v-if="cfv.kind !== 'picture'"
              :label="cfv.label"
              :prop="'customFieldValues.' + index +'.value'"
              :rules="{required: cfv.required, message: cfv.label+'不能为空', trigger: 'blur'}"
            >
              <el-input v-if="cfv.kind === 'string'" v-model="cfv.value" />

              <el-select
                v-if="cfv.kind === 'select'"
                v-model="cfv.value"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(_item, _idx) in cfv.optionList"
                  :key="_idx + '_select_' + cfv.id"
                  :label="_item"
                  :value="_item"
                />
              </el-select>

              <el-checkbox-group v-if="cfv.kind === 'checkboxes'" v-model="cfv.value">
                <el-checkbox
                  v-for="(_item, _idx) in cfv.optionList"
                  :key="_idx + '_checkboxes_' + cfv.id"
                  :label="_item"
                  :value="_item"
                />
              </el-checkbox-group>
              <p class="help-block">{{ cfv.hint }}</p>
            </el-form-item>
            <el-form-item
              v-if="cfv.kind === 'picture'"
              :label="cfv.label"
              :prop="'customFieldValues.' + index +'.value'"
            >
              <img
                :id="'cfv_picture_'+ cfv.id"
                :ref="'cfv_picture_'+ cfv.id"
                :src="(cfv.picture_list && cfv.picture_list.length) ? cfv.picture_list[0]['url'] : ''"
                :class="{'img-thumbnail': cfv.picture_list, 'avatar-thumbnail-middle': cfv.picture_list}"
                :style="{'display': (cfv.picture_list ? 'block': 'none')}"
              >
              <el-upload
                action="#"
                :data="cfv"
                :file-list="cfv.picture_list"
                accept="image/*"
                :show-file-list="false"
                :http-request="listenUploadImageLimit"
                :on-success="uploadSuccess"
              >
                <el-button type="success" size="medium">上传</el-button>
              </el-upload>
              <p class="help-block">{{ cfv.hint }}</p>
            </el-form-item>
          </div>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit($route.name === 'ProductNew' ? 'add' : 'edit')">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import product from '@/api/product'
import custom_form from '@/api/custom_form'
import amazon from '@/api/amazon'
import editorImage from '@/components/Tinymce/components/CustomUploadImage'

export default {
  components: {
    editorImage
  },
  data() {
    return {
      loading: false,
      submitting: false,
      custom_form: [],
      fieldsList: [],
      form: {
        code: null,
        price: null,
        spec: null,
        name: null,
        ean13: null,
        description: null,
        url: null,
        firm: null,
        address: null,
        origin: null,
        phone: null,
        imageList: [],
        customFieldValues: []
      },
      rules: {
        name: [
          { required: true, message: `产品名称不能为空`, trigger: 'blur' }
        ]
      }
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '产品列表', path: { name: 'ProductIndex' }},
      { title: `${this.$route.name === 'ProductEdit' ? '编辑' : '新建'}产品` }
    ])
    if (this.$route.name === 'ProductEdit') {
      await product.show(this.$route.params.id).then(response => {
        this.form = response.data
      })
    }
    custom_form.product().then(response => {
      this.custom_form = response.data.customFields
      this.fieldsList = response.data.fieldsList

      this.form.customFieldValues = this.custom_form.map(field => {
        const fv = this.setCustomFieldValue(field)
        let value = ''
        if (fv) {
          field.oid = fv.id
        }

        if (field.kind === 'checkboxes') {
          if (fv && fv.valueList && fv.valueList.length) {
            value = fv.valueList
          } else {
            value = []
          }
        }

        if (field.kind === 'picture') {
          if (fv && fv.pictureUrl) {
            field.picture_list = [
              { name: fv.pictureFileName, url: fv.pictureUrl, id: field.id }
            ]
          }
        }

        if (['select', 'string'].includes(field.kind)) {
          if (fv && fv.value) {
            value = fv.value
          }
        }

        return {
          ...field,
          value: value
        }
      })
    })
  },
  methods: {
    customField(v) {
      return this.custom_form.find(f => f.id === v.id)
    },
    setCustomFieldValue(v) {
      return this.form.customFieldValues.find(f => f.customField.id === v.id)
    },
    uploadSuccess(response) {
    },

    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      params.data.picture_list = []
      amazon.tmp(formData).then(response => {
        params.data.value = response.data.id
        params.data.picture_list = [{ name: response.data.fileFileName, url: response.data.imageUrl, id: params.data.id }]

        this.$refs[`cfv_picture_${params.data.id}`][0]['src'] = response.data.imageUrl
        this.$refs[`cfv_picture_${params.data.id}`][0]['style'].display = 'block'
        this.$refs[`cfv_picture_${params.data.id}`][0].classList = 'img-thumbnail avatar-thumbnail-middle'
        loading.close()
      }).catch(() => {
        loading.close()
      })
    },
    async submit(action) {
      // 格式化自定义表单数据
      const customFieldValues = []
      this.form.customFieldValues.forEach(cfv => {
        let value = { customFieldId: cfv.id }
        if (cfv.oid) {
          value = { ...value, id: cfv.oid }
        }

        switch (cfv.kind) {
          case 'picture':
            value['pictureId'] = cfv.value
            break
          case 'checkboxes':
            value['value'] = cfv.value.join()
            break
          default:
            value['value'] = cfv.value
            break
        }
        if (cfv.kind !== 'picture') {
          customFieldValues.push({
            ...value
          })
        } else {
          if (!cfv.value) {
            delete value.pictureId
          }
          customFieldValues.push({
            ...value
          })
        }
      })

      // 拷贝数据
      const data = Object.assign({}, this.form)
      data.customFieldValues = customFieldValues

      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          product[action](data).then(response => {
            this.submitting = false
            this.$router.push({ name: 'TUnitBatchesShow', params: { id: response.data.id }})
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    },
    setSlideImage(image) {
      console.log(image)
    }
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
</style>
