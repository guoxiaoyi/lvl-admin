<template>
  <div>
    <el-form v-for="(item, index) in values.data" :key="index + '-title-form'" ref="form" label-width="85px">
      <el-form-item label="选择模板" class="content-full">
        <el-radio-group v-model="values.data[index]['align']">
          <el-radio label="left">居左</el-radio>
          <el-radio label="center">居中</el-radio>
          <el-radio label="right">居右</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题文字" class="content-full">
        <el-input v-model="values.data[index]['title']" placeholder="最多20个字" />
      </el-form-item>
      <el-form-item label="跳转地址" class="content-full">
        <el-input v-model="values.data[index]['url']" placeholder="必须以https://开头,如https://www.lifanli.cn" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
