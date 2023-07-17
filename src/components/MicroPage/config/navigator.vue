<template>
  <el-form ref="form" label-width="68px">
    <el-form-item label="选择模板" class="content-full">
      <el-radio-group v-model="values.block">
        <el-radio label="img_navigator">大图文导航</el-radio>
        <el-radio label="img_navigator_small">小图文导航</el-radio>
      </el-radio-group>
    </el-form-item>
    <div v-for="(item, index) in values.data" :key="index + '-swiper-item'" class="add-item flex">
      <div class="thumb-image">
        <img :src="item.image_url">
        <span>更换图片</span>
      </div>
      <div class="flex-item">
        <el-form-item label="图片标题" class="content-full">
          <el-input v-model="values.data[index]['title']" placeholder="最多26个字" maxlength="26" />
        </el-form-item>
        <el-form-item label="跳转地址" class="content-full">
          <Link :item="item" />
        </el-form-item>
      </div>
    </div>
    <div class="flex add-item-btn" style="flex-direction: column;">
      <p class="add-image-text"><i class="fa fa-plus" />添加一个图文导航(还可添加1个)</p>
    </div>
  </el-form>
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
