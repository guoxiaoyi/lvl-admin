<template>
  <div>
    <el-breadcrumb v-if="!loading" separator="/">
      <el-breadcrumb-item><span style="font-weight: bold; cursor: pointer;" @click="redirectTo('home')">首页</span></el-breadcrumb-item>
      <el-breadcrumb-item> {{ datas.content[datas.content.length -1]['category']['name'] }} </el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="!loading" class="qus_list_title">
      {{ datas.content[datas.content.length -1]['category']['name'] }}
      <span class="qus_list_num">共 {{ datas.totalElements }} 条问题</span>
    </div>
    <div class="qus_list_content">
      <div
        v-for="item in datas.content"
        :key="item.id"
        class="link"
        @click="redirectToArticle(item)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleList } from '@/api/help_center.js'
export default {
  props: {
    categoryId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: true,
      datas: {
        content: []
      }
    }
  },
  watch: {
    categoryId(newValue) {
      if (newValue) {
        this.fetch()
      }
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    redirectTo(temp) {
      this.$emit('redneTemplate', temp)
    },
    redirectToArticle(item) {
      this.$emit('redneTemplate', 'help_center_article')
      this.$emit('getArticle', { id: item.id, categoryId: item.category.id })
    },
    async fetch() {
      const data = await getArticleList({ categoryId: this.categoryId })
      this.datas = data
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.qus_list_title {
  font-weight: 500;
  font-size: 24px;
  line-height: 34px;
  color: #000;
  margin-bottom: 10px;
  margin-top: 15px;
}
.qus_list_num{
  font-size: 14px;
  line-height: 20px;
  color: #8d9299;
  margin-left: 10px;
  font-weight: normal;
}
.qus_list_content {
  .link{
    font-size: 14px;
    line-height: 30px;
    color: #606266;
    cursor: pointer;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space:nowrap;
    display: block;
    img {
      margin-right: 5px;
      vertical-align: middle;
      margin-top: -3px;
    }
  }
}
</style>
