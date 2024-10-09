<template>
  <div v-loading="loading">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><span style="font-weight: bold; cursor: pointer;" @click="redirectTo('home')">首页</span></el-breadcrumb-item>
      <el-breadcrumb-item><span style="font-weight: bold; cursor: pointer;" @click="openCategory(article.category)">{{ article.category.name }}</span></el-breadcrumb-item>
      <el-breadcrumb-item>{{ article.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h4 class="title">{{ article.title }}</h4>
    <p class="help-block">发布时间：{{ article.publishedAt }}</p>
    <Viewer v-if="!loading" :initial-value="article.content" height="500px" />
  </div>
</template>

<script>
import helpCenterApi from '@/api/help_center.js'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import { Viewer } from '@toast-ui/vue-editor'
export default {
  components: {
    Viewer
  },
  props: {
    articleId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: true,
      article: {
        category: {}
      }
    }
  },
  mounted() {
    // console.log(this.articleId)
    helpCenterApi.getArticle({ id: this.articleId }).then(response => {
      this.article = response
      this.loading = false
    })
  },
  methods: {
    redirectTo(temp) {
      this.$emit('redneTemplate', temp)
    },
    openCategory(category) {
      this.redirectTo('help_center_category')
      this.$emit('openCategory', category)
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
  .toastui-editor-contents {
    video {
      width: 100%;
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
