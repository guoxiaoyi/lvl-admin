<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> {{ $route.name === 'ProductEdit' ? '编辑' : '新建' }}产品 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <!-- <CustomForm v-model="form" type="CustomForms::Product" :status="submitting" @submit="submit" /> -->
        <el-form v-if="!loading" ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <div v-for="item in fieldsList" :key="item.value" :label="item.value">
            <el-form-item v-if="item.type === 'fixed' && item.value === 'price'" label="价格">
              <el-input v-model="form.price">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'images'" label="图片">
              <div style="display: flex; flex-wrap: wrap;">
                <el-card v-for="(image, index) in form.imageList" :key="index" shadow="always" class="slide-image" :body-style="{ padding: '0px', display: 'flex' }">
                  <div class="delete-item" @click="removeSlideItem(image)">
                    <i class="el-icon-delete-solid" />
                  </div>
                  <el-image class="image-item" :src="image.url" fit="cover" />
                </el-card>
              </div>
              <editorImage type="success" @successCBK="setSlideImage" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'spec'" label="规格">
              <el-input v-model="form.spec" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'name'" label="产品名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'ean_13'" label="商品条码">
              <el-input v-model="form.ean13" />
            </el-form-item>
            <el-form-item v-if="item.type === 'fixed' && item.value === 'code'" label="产品代码">
              <el-input v-model="form.code" />
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
          <CustomForm ref="customFieldsRef" :form.sync="form.customFieldValues" :fields="customFieldList" />
          <hr>
          <el-button type="success" :loading="submitting" @click="submit($route.name === 'ProductNew' ? 'add' : 'edit')">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import product from '@/api/product'
import editorImage from '@/components/Tinymce/components/CustomUploadImage'
import custom_form from '@/api/v2_custom_form'
import CustomForm from '@/components/CustomForm'

export default {
  components: {
    editorImage,
    CustomForm
  },
  data() {
    return {
      loading: false,
      submitting: false,
      customFieldList: [],
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
      imageIds: [],
      rules: {
        name: [
          { required: true, message: `产品名称不能为空`, trigger: 'blur' }
        ]
      }
    }
  },
  async mounted() {
    await custom_form.product().then(response => {
      this.fieldsList = response.data.fieldsList
      this.customFieldList = response.data.customFields
    })
    if (this.$route.name === 'ProductEdit') {
      await product.show(this.$route.params.id).then(response => {
        this.form = { ...this.form, ...response.data }
      })
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '产品列表', path: { name: 'ProductIndex' }},
        { title: this.form.name, path: { name: 'ProductShow', params: { id: this.form.id }}},
        { title: `${this.$route.name === 'ProductEdit' ? '编辑' : '新建'}产品` }
      ])
    } else {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '产品列表', path: { name: 'ProductIndex' }},
        { title: `${this.$route.name === 'ProductEdit' ? '编辑' : '新建'}产品` }
      ])
    }
  },
  methods: {
    async submit(action) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          const data = JSON.parse(JSON.stringify(this.form))
          data.customFieldValues = this.$refs.customFieldsRef.getProcessedData()
          product[action](data).then(response => {
            this.submitting = false
            this.$router.push({ name: 'ProductIndex' })
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    },
    setSlideImage(image) {
      this.form.imageList.unshift(image)
    },
    removeSlideItem(current) {
      this.form.imageList = this.form.imageList.filter(image => image.id !== current.id)
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
