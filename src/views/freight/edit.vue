<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="默认物流公司" prop="name">
            <el-select
              v-model="form.expressId"
              size="small"
              filterable
              reserve-keyword
              placeholder="请输入"
            >
              <el-option
                v-for="item in express_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <p class="help-block"> 积分商城如有实物礼品需要快递发货，可配置此项；如无实物类礼品，则可忽略此项。 </p>
          </el-form-item>
          <el-form-item label="首重件数" prop="baseQuantity">
            <el-input v-model.number="form.baseQuantity" />
            <p class="help-block"> 设置多少件以内都算作首重；包邮，或统一运费，请设置为0 </p>
          </el-form-item>
          <el-form-item label="首重运费" prop="basePrice">
            <el-input v-model="form.basePrice" />
            <p class="help-block"> 包邮，请设置为0元 </p>
          </el-form-item>
          <el-form-item label="续重件数" prop="perAddQuantity">
            <el-input v-model.number="form.perAddQuantity" />
            <p class="help-block"> 设置多少件计一次续重运费 </p>
          </el-form-item>
          <el-form-item label="续重运费" prop="perAddPrice">
            <el-input v-model="form.perAddPrice" />
            <p class="help-block">每计一次续重的运费</p>
          </el-form-item>
          <el-form-item label="可发货地区" prop="regions">
            <el-select
              v-model="form.regions"
              size="small"
              multiple
              filterable
              placeholder="请输入"
            >
              <el-option v-for="item in province" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <p class="help-block"> 选择可发货的地区；留空，即为全国发货 </p>
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/freight.vue'
import region_api from '@/api/region'
import freight from '@/api/freight'
import express from '@/api/express'
export default {
  components: {
    tab
  },
  data() {
    return {
      rules: {},
      form: {
        basePrice: 0,
        baseQuantity: 0,
        expressId: null,
        expressName: '',
        perAddPrice: 0,
        perAddQuantity: 0,
        regions: [],
        regionNames: [
          {}
        ]
      },
      submitting: false,
      province: [],
      channel_list: [],
      express_list: []
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '运费设置' }
    ])
    region_api.getChildren({}).then(response => {
      this.province = response.data
    })
    freight.get().then(response => {
      this.form = response.data
    })
    express.list().then(response => {
      this.express_list = response.data
    })
  },
  methods: {
    submit() {
      this.submitting = true
      freight.edit(this.form).then(response => {
        this.submitting = false
        this.$message.success('更新成功')
      }).catch(_err => {
        this.submitting = false
      })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
