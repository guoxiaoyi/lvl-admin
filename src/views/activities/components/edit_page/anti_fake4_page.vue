<template>
  <div>
    <el-form-item :ref="var2LowerCase('video_type')" :label="$t('page.video_type')" prop="video_type">
      <el-radio-group v-model="form.video_type">
        <el-radio label="video_code">{{ $t('page.attrbutes.banner_type.video_code') }}</el-radio>
        <el-radio label="video_file">{{ $t('page.attrbutes.banner_type.video_file') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="form.video_type === 'video_file'" :ref="var2LowerCase('video_id')" prop="video_id">
      <div v-if="form.video_img_url" class="video-item">
        <div class="thumbnail">
          <el-image :src="form.video_img_url" />
          <div class="video-del" @click="form.video_id = null; form.video_img_url = null">
            <i class="fa fa-times-circle fa-lg" />
          </div>
        </div>
      </div>
      <el-button type="success" @click="videoDialog = true"><i class="fa fa-plus" /> 添加视频</el-button>
      <p class="help-block">视频不能超过10M，格式：MP4</p>
    </el-form-item>
    <el-form-item v-if="form.video_type === 'video_code'" :ref="var2LowerCase('video_code')" :label="$t('page.video_code')" prop="video_code">
      <el-input v-model="form.video" type="textarea" :rows="5" />
      <p class="help-block">将视频上传至其他视频网站后（推荐哔哩哔哩），打开视频找到左下角分享，复制嵌入代码，粘贴到此处即可。</p>
    </el-form-item>
    <SelectVideo :show.sync="videoDialog" @selectChange="selectdVideo" />
  </div>
</template>

<script>
import SelectVideo from '@/components/Assets/video.vue'
export default {
  components: {
    SelectVideo
  },
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      videoDialog: false
    }
  },
  methods: {
    selectdVideo(data) {
      this.form.video_img_url = data.imgUrl
      this.form.video_id = data.id
    }
  }
}
</script>
<style lang="scss" scoped>
.thumbnail {
  position: relative;
  display: block;
  padding: 4px;
  margin-bottom: 20px;
  line-height: 1.428571429;
  background-color: #FBFBFB;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border 0.2s ease-in-out;
  width: 100px;
  img {
    vertical-align: middle;
  }
}
.fa-lg {
  font-size: 1.33333333em;
  line-height: 0.75em;
  vertical-align: -15%;
  cursor: pointer;
}
.video-del {
  position: absolute;
  top: -8px;
  right: -8px;
  color: #da120e;
}
</style>
