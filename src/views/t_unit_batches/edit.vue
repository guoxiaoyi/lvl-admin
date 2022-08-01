<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 编辑生产批次 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form size="small" ref="form" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="批次号" prop="code">
            <el-input v-model="form.code" />
            <p class="help-block">默认自动生成，可手动修改</p>
          </el-form-item>
          <el-form-item label="产品" prop="productId">
            <el-select
              size="small"
              v-model="form.productId"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethod"
              :loading="searchLoading">
              <el-option
                v-for="(item, index) in productList"
                :key="'pro'+index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套码规格" prop="code">
            <el-select v-model="form.unitSpecId" placeholder="请选择">
              <el-option
                v-for="(item, index) in unitSpec"
                :key="'unit' + index"
                :label="item.unitSpecName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生产日期" prop="code">
            <el-date-picker
              v-model="form.producedDate"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <div v-for="(cfv, index) in form.customFieldValues" :key="index+'custom'">
            <el-form-item
              v-if="cfv.kind !== 'picture'"
              :label="cfv.label"
              :prop="'customFieldValues.' + index +'.value'"
              :rules="{required: cfv.required, message: cfv.label+'不能为空', trigger: 'blur'}">
              <el-input v-if="cfv.kind === 'string'" v-model="cfv.value" />

              <el-select
                v-if="cfv.kind === 'select'"
                placeholder="请选择"
                clearable
                v-model="cfv.value">
                <el-option
                  v-for="(_item, _idx) in cfv.optionList"
                  :key="_idx + '_select_' + cfv.id"
                  :label="_item"
                  :value="_item">
                </el-option>
              </el-select>

              <el-checkbox-group v-if="cfv.kind === 'checkboxes'" v-model="cfv.value">
                <el-checkbox
                  v-for="(_item, _idx) in cfv.optionList"
                  :key="_idx + '_checkboxes_' + cfv.id"
                  :label="_item"
                  :value="_item">
                </el-checkbox>
              </el-checkbox-group>
              <p class="help-block">{{cfv.hint}}</p>
            </el-form-item>
            <el-form-item
              v-if="cfv.kind === 'picture'"
              :label="cfv.label"
              :prop="'customFieldValues.' + index +'.value'">
              <img
                :src="(cfv.picture_list && cfv.picture_list.length) ? cfv.picture_list[0]['url'] : ''"
                :id="'cfv_picture_'+ cfv.id"
                :ref="'cfv_picture_'+ cfv.id"
                :class="{'img-thumbnail': cfv.picture_list, 'avatar-thumbnail-middle': cfv.picture_list}"
                :style="{'display': (cfv.picture_list ? 'block': 'none')}" />
              <el-upload
                action="#"
                :data="cfv"
                :file-list="cfv.picture_list"
                accept="image/*"
                :show-file-list="false"
                :http-request="listenUploadImageLimit"
                :on-success="uploadSuccess">
                <el-button type="success" size="medium">上传</el-button>
              </el-upload>
              <p class="help-block">{{cfv.hint}}</p>
            </el-form-item>
          </div>

          <el-form-item label="备注" style="margin-top: 5px">
            <el-input v-model="form.note" type="textarea"></el-input>
          </el-form-item>
          <hr />

          <el-button type="success" @click="submit($route.name === 'TUnitBatchesNew' ? 'add' : 'edit')" :loading="submitting">
            保存
          </el-button>

        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import t_unit_batches from "@/api/t_unit_batches"
import custom_form from "@/api/custom_form"
import amazon from "@/api/amazon"
import product from "@/api/product"
export default {
  data() {
    return {
      custom_form: [],

      rules: {

      },
      form: {
        note: "",
        producedDate: "",
        productId: null,
        unitSpecId: null,
        customFieldValues: []
      },
      submitting: false,
      searchLoading: false,
      productList: [],
      unitSpec: []
    }
  },
  watch: {
    'form.productId'(newValue, oldValue) {
      if(oldValue && newValue) {
        this.form.unitSpecId = null
      }
      if(newValue){
        this.unitSpec = this.productList.find(product => product.id === newValue).unitSpec
      }
      if (!newValue) {
        this.form.unitSpecId = null
        this.unitSpec = []
      }
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      {title: '生产批次列表', path: {name: 'TUnitBatchesIndex'} },
      {title: '编辑生产批次'}
    ])
    await product.all().then(response => {
      this.productList = response.data
    })
    console.log(this.$route.name)
    if(this.$route.name === 'TUnitBatchesEdit') {
      await t_unit_batches.show(this.$route.params).then(response => {
        this.form = response.data
      })
    }
    custom_form.t_unit_batch().then(response => {
      this.custom_form = response.data

      this.form.customFieldValues = this.custom_form.map(field => {

        let fv = this.setCustomFieldValue(field)
        let value = ''
        if (fv) {
          field.oid = fv.id
        }

        if (field.kind === 'checkboxes'){
          if (fv && fv.valueList && fv.valueList.length) {
            value = fv.valueList
          } else {
            value = []
          }
        }

        if (field.kind === 'picture'){
          if (fv && fv.pictureUrl) {
            field.picture_list = [
              {name: fv.pictureFileName, url: fv.pictureUrl, id: field.id }
            ]
          }
        }

        if(['select', 'string'].includes(field.kind)) {
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
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true;
        setTimeout(() => {
          product.all({name: query.toLowerCase()}).then(response => {
            this.searchLoading = false;
            this.productList = response.data
          })
        }, 200);
      } else {
        this.productList = [];
      }
    },
    customField(v) {
      return this.custom_form.find( f => f.id === v.id)
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
      });
      params.data.picture_list = []
      amazon.tmp(formData).then(response => {
        params.data.value = response.data.id
        params.data.picture_list = [{name: response.data.fileFileName, url: response.data.imageUrl, id: params.data.id}]

        this.$refs[`cfv_picture_${params.data.id}`][0]['src'] = response.data.imageUrl
        this.$refs[`cfv_picture_${params.data.id}`][0]['style'].display = 'block'
        this.$refs[`cfv_picture_${params.data.id}`][0].classList = 'img-thumbnail avatar-thumbnail-middle'
        loading.close()
      }).catch(() => {
        loading.close()
      })
    },
    async submit(action){
      // 格式化自定义表单数据
      let customFieldValues = []
      this.form.customFieldValues.forEach(cfv => {
        let value = {customFieldId: cfv.id}
        if (cfv.oid){
          value = {...value, id: cfv.oid}
        }

        switch (cfv.kind){
          case 'picture':
            value['pictureId'] = cfv.value
            break;
          case 'checkboxes':
            value['value'] = cfv.value.join()
            break;
          default:
            value['value'] = cfv.value
            break;
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
          console.log(data)
          t_unit_batches[action](data).then(response => {
            this.submitting = false
            // this.$router.push({name: 'ChannelShow', params: {id: data.id || response.data.id}})
          }).catch(() => {
            this.submitting = false
          })

        } else {
          return false;
        }
      })
    },
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
