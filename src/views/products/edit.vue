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
          <el-form-item label="产品代码">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="图片">
            <el-button type="success">添加图片</el-button>
          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="产品名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="商品条码">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="产品链接">
            <el-input v-model="form.name" type="textarea" />
            <p class="help-block">为产品的展示或者购买页面，如果没有可不填（链接格式如:'http://www.lifanli.cn'）</p>
          </el-form-item>
          <el-form-item label="生产商">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="产地">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="生产批次">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="测试">
            <el-input v-model="form.name" />
          </el-form-item>
          <hr />
          <el-button type="success">创建产品</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      form: {},
      rules: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '产品列表', path: { name: 'ProductIndex' }},
      { title: '新建产品' }
    ])
  }
}
</script>
<style>
</style>
