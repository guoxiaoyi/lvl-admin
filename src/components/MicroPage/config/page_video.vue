<template>
  <el-form ref="form" label-width="68px">
    <el-form-item label="类型" class="content-full">
      <el-radio-group v-model="values.data.kind">
        <el-radio label="iframe">嵌入视频网站代码</el-radio>
        <el-radio label="upload">上传视频文件</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="values.data.kind === 'iframe'" label="嵌入代码" class="content-full">
      <el-input v-model="values.data.html" type="textarea" :rows="4" />
    </el-form-item>
    <el-form-item v-if="values.data.kind === 'upload'" label="选择文件" class="content-full">
      <div class="goods-item-add"> + </div>
      <div style="clear: both; font-size: 12px; line-height: 1.4;">视频不能超过10M, 格式: MP4</div>
    </el-form-item>
  </el-form>
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
