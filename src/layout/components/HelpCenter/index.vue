<template>
  <div class="help-center" :style="{ width }">
    <div class="header flex justify-content__space-between items-center">
      <h4>帮助中心</h4>
      <div>
        <el-button type="text" class="close" @click="close"><i class="el-icon-close" /></el-button>
      </div>
    </div>
    <help_center_search ref="searchRef" @search="search" @redneTemplate="redneTemplate" />
    <div v-loading="loading" class="content">
      <component
        :is="temp"
        :article-id="articleId"
        :category-id="categoryId"
        :video-id="videoId"
        :blurry="blurry"
        @treeLoaded="treeLoaded"
        @redneTemplate="redneTemplate"
        @getArticle="getArticle"
        @getVideo="getVideo"
        @openCategory="openCategory"
      />
    </div>
    <div class="footer">
      <a :href="openUrl" target="_blank">打开帮助中心 <img src="@/assets/waibulianjie.png"></a>
    </div>
  </div>
</template>

<script>
import home from './home.vue'
import help_center_article from './article.vue'
import help_center_video from './video.vue'
import help_center_search from './search.vue'
import help_center_result from './result.vue'
import help_center_category from './category.vue'
import help_center_video_category from './videoList.vue'
const url = '//admin.lifanli.cn/lgp/portal/help'
export default {
  components: {
    home,
    help_center_article,
    help_center_video,
    help_center_search,
    help_center_result,
    help_center_category,
    help_center_video_category
  },
  data() {
    return {
      loading: true,
      temp: 'home',
      articleId: null,
      categoryId: null,
      videoId: null,
      blurry: null,
      width: '300px',
      openUrl: url
    }
  },
  watch: {
    temp(newValue, oldValue) {
      switch (newValue) {
        case 'home':
          this.width = '300px'
          break
        default:
          this.width = '460px'
          break
      }
    }
  },
  mounted() {

  },
  methods: {
    treeLoaded() {
      this.loading = false
    },
    redneTemplate(data) {
      if (data === 'home') {
        this.$refs.searchRef.blurry = null
        this.openUrl = url
      }
      this.temp = data
      this.loading = false
    },
    getArticle(data) {
      this.articleId = data.id
      this.openUrl = `${url}/articles/${data.id}?cid=${data.categoryId}`
      this.loading = false
    },
    getVideo(data) {
      this.videoId = data.id
      this.openUrl = `${url}/videos/${data.id}`
      this.loading = false
    },
    openCategory(data) {
      this.$refs.searchRef.blurry = null
      this.categoryId = data.id
      this.openUrl = `${url}/categories/${data.id}`
    },
    search(data) {
      this.temp = 'help_center_result'
      this.blurry = data
      this.openUrl = `${url}/search?blurry=${data}`
    },
    close() {
      this.$store.dispatch('app/toggleHelpCenter', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.help-center {
  width: 300px;
  height: 700px;
  position: fixed;
  right: 0;
  bottom: 0;
  border-radius: 3px;
  box-shadow: 0 0 10px 2px rgba($color: #000000, $alpha: .1);
  background: #FFF;
  z-index: 3;
  overflow: hidden;
  .header {
    padding: 10px;
    background: #F34541;
    .close {
      font-size: 18px;
      color: #FFF;
      padding: 0;
      i {
        font-weight: bold;
      }
    }
    h4 {
      margin: 0;
      padding: 0;
      color: #FFF;
    }
  }
  .content {
    overflow-y: auto;
    height: 570px;
    padding: 15px;
  }
  .footer {
    position: relative;
    z-index: 4;
    padding: 10px 20px;
    box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, .06);
    img {
      vertical-align: middle;
      width: 20px;
      margin-top: -5px;
    }
  }
}

</style>
