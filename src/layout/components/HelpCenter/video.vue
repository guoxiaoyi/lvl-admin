<template>
  <div v-loading="loading">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><span style="font-weight: bold; cursor: pointer;" @click="redirectTo('home')">首页</span></el-breadcrumb-item>
      <el-breadcrumb-item><span style="font-weight: bold; cursor: pointer;" @click="openCategory(article.category)">{{ article.category.name }}</span></el-breadcrumb-item>
      <el-breadcrumb-item>{{ article.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h4 class="title">{{ article.title }}</h4>
    <p class="help-block">发布时间：{{ article.publishedAt }}</p>
    <video-player v-if="!loading" :options="videoOptions" />
  </div>
</template>

<script>
import helpCenterApi from '@/api/help_center.js'
import VideoPlayer from '@/components/VideoPlayer.vue'
export default {
  components: {
    VideoPlayer
  },
  props: {
    videoId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: true,
      article: {
        category: {}
      },
      videoOptions: {}
    }
  },
  mounted() {
    // console.log(this.videoId)
    helpCenterApi.getArticle({ id: this.videoId }).then(response => {
      this.article = response
      this.videoOptions = {
        autoplay: true,
        controls: true,
        // aspectRatio: '16:9',
        width: '430px',
        sources: [
          {
            src: response.videoUrl,
            type: 'video/mp4'
          }
        ]
      }
      this.loading = false
    })
  },
  methods: {
    openCategory(category) {
      this.redirectTo('help_center_video_category')
      this.$emit('openCategory', category)
    },
    redirectTo(temp) {
      this.$emit('redneTemplate', temp)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-breadcrumb {
    .el-breadcrumb__inner {
      .link {
        font-weight: bold;
      }
    }
  }
}
.title {
  margin: 15px 0;
  margin-bottom: 5px;
}
.help-block {
  display: block;
  margin-top: 5px;
  margin-bottom: 10px;
  color: #737373;
}
</style>
