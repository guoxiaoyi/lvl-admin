<template>
  <div class="panel panel-default">
    <components :is="item.temp" v-for="(item, index) in labels" :key="item.temp" :title="item.title">
      <span slot="title">{{ item.title }}<i class="fa fa-edit" @click="edit(index)" /></span>
    </components>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible="modal.show > 0"
      title="修改标题"
      width="600px"
    >
      <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-divider />
        <el-button type="success" :loading="modal.show > 1" @click="submit">保存</el-button>
        <el-button @click="modal.show = 0">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import product_materials from './product_materials.vue'
import product_processes from './product_processes.vue'
import product_qualification from './product_qualification.vue'
import product_additional_info from './product_additional_info.vue'

import point_store from '@/api/point_store.js'
export default {
  components: {
    product_materials,
    product_processes,
    product_qualification,
    product_additional_info
  },
  data() {
    return {
      labels: { },
      rules: {

      },
      modal: {
        show: 0
      },
      form: {
        t: null,
        title: null
      }
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    fetch() {
      point_store.product_label_setting().then(({ data }) => {
        this.labels = {
          productMaterialLabel: { title: '原材料', temp: 'product_materials' },
          productProcessLabel: { title: '生产加工流程', temp: 'product_processes' },
          productQualificationLabel: { title: '资质信息', temp: 'product_qualification' },
          productAdditionalInfoLabel: { title: '其他信息', temp: 'product_additional_info' }
        }
        Object.keys(data).forEach(element => {
          if (data[element]) {
            this.labels[element]['title'] = data[element]
          }
        })
      })
    },
    edit(t) {
      this.modal.show = 1
      this.form.t = t
      this.form.title = this.labels[t]['title']
    },
    submit() {
      const form = {}
      this.modal.show = 2
      form[this.form.t] = this.form.title
      point_store.edit_product_label_setting(form).then(({ data }) => {
        window.location.reload()
        this.modal.show = 0
      }).catch(fail => {
        this.modal.show = 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fa-edit {
  cursor: pointer;
  margin-left: 5px;
}
::v-deep {
  .panel-body {
    padding: 10px 15px;
  }
}
</style>
