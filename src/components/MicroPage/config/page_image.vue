<template>
  <div>
    <el-form ref="form" label-width="68px">
      <div class="add-item flex">
        <div class="thumb-image">
          <img :src="values.data.image_url">
          <span>更换图片</span>
        </div>
        <div class="flex-item">
          <el-form-item label="跳转地址" class="content-full">
            <Link :item="values.data" />
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import Link from '../Link'
export default {
  components: { Link },
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style>

</style>
