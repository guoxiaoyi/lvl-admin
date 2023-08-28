<template>
  <el-form ref="form" label-width="85px">
    <el-form-item label="类型" class="content-full">
      <el-radio-group v-model="values.data.kind">
        <el-radio label="iframe">嵌入视频网站代码</el-radio>
        <el-radio v-if="checkPer(['video_manage'])" label="upload">上传视频文件</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="values.data.kind === 'iframe'" label="嵌入代码" class="content-full">
      <el-input v-model="values.data.html" type="textarea" :rows="4" />
    </el-form-item>
    <el-form-item v-if="values.data.kind === 'upload'" label="选择文件" class="content-full">
      <div v-if="!values.data.video_id" class="goods-item-add" @click="show = true"> + </div>
      <div v-else class="goods-item-preview">
        <a class="image-url" @click="show = true">
          <img :src="values.data.video_cover" alt="商品图">
        </a>
        <i class="goods-item-delete" @click="remove" />
      </div>
      <div style="clear: both; font-size: 12px; line-height: 1.4;">视频不能超过10M, 格式: MP4</div>
    </el-form-item>
    <select-video :show.sync="show" @selectChange="selectd" />
  </el-form>
</template>

<script>
import selectVideo from '@/components/Assets/video.vue'
export default {
  components: {
    selectVideo
  },
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: false
    }
  },
  mounted() {
    if (!this.checkPer(['video_manage'])) {
      this.values.data.kind = 'iframe'
    }
  },
  methods: {
    selectd(data) {
      this.values.data.video_cover = data.imgUrl
      this.values.data.video_id = data.id
    },
    remove() {
      this.values.data.video_cover = null
      this.values.data.video_id = null
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-item-preview {
  display: flex;
  position: relative;
  float: left;
  margin: 5px 10px 5px 0;
  width: 50px;
  height: 50px;
  box-shadow: 0 0 4px 0 rgba(10,42,97,0.2);
  background: #fff;
  a {
    display: block;
    height: 100%;
    width: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .goods-item-delete {
    position: absolute;
    width: 16px;
    height: 16px;
    font-style: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    right: -8px;
    top: -8px;
    line-height: 16px;
    cursor: pointer;
    background-image: url('~@/assets/remove.png');
    background-size: 35%;
    background-color: #999;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 50%;
  }
}
</style>
