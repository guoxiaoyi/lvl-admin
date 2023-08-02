<template>
  <div>
    <el-form v-for="(item, index) in values.data" :key="index + '-notice-form'" ref="form" label-width="68px">
      <el-form-item label="公告文字" class="content-full">
        <el-input v-model="values.data[index]['content']" placeholder="请填写公告内容,最多50个字" maxlength="50" />
      </el-form-item>
      <el-form-item label="背景色" class="content-full">
        <div class="flex">
          <el-color-picker v-model="values.data[index]['bg_color']" />
          <el-button type="text" class="reset" @click="values.data[index]['bg_color'] = '#FFF'">重置</el-button>
        </div>
      </el-form-item>
      <el-form-item label="字体颜色" class="content-full">
        <div class="flex">
          <el-color-picker v-model="values.data[index]['font_color']" />
          <el-button type="text" class="reset" @click="values.data[index]['font_color'] = '#333'">重置</el-button>
        </div>
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
<style lang="scss" scoped>
::v-deep {
  .reset {
    margin-left: 10px;
  }
}
</style>
