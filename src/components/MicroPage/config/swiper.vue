<template>
  <div>
    <el-form ref="form" label-width="68px">
      <el-form-item label="选择模板" class="content-full">
        <el-radio-group v-model="values.block">
          <el-radio label="swiper">幻灯片横向滑动</el-radio>
          <el-radio label="swiper_margin">轮播幻灯片</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-for="(item, index) in values.data" :key="index + '-swiper-item'" class="add-item">
        <div class="thumb-image">
          <img :src="item.image_url">
          <span>更换图片</span>
        </div>
        <div class="flex-item">
          <el-form-item label="图片标题">
            <el-input v-model="values.data[index]['text']" />
          </el-form-item>
          <el-form-item label="跳转地址">
            <div @click="linkModal.show = true">{{ item.link_type }}</div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <Link v-if="linkModal.show" :modal="linkModal" />
  </div>
</template>

<script>
import Link from '../Link'
export default {
  components: {
    Link
  },
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      linkModal: {
        show: false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
}
.add-item {
  position: relative;
  background-color: #fff;
  margin: 15px 0;
  padding: 15px;
  border: 1px dashed #e5e5e5;
  align-items: center;
  cursor: pointer;
  display: flex;
  .thumb-image {
    width: 80px;
    height: 80px;
    position: relative;
    border: 1px solid #e5e5e5;
    text-align: center;
    color: #999;
    margin-right: 15px;
    overflow: hidden;
    cursor: pointer;
    span {
      display: block;
      width: 100%;
      background: rgba(0,0,0,0.5);
      height: 20px;
      line-height: 20px;
      color: #FFF;
      position: absolute;
      bottom: 0;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
