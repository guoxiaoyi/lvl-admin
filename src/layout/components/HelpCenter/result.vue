<template>
  <div>
    <div class="qus_list_title">
      搜索结果
      <span class="qus_list_num">找到 {{ totalElements || 0 }} 个结果</span>
    </div>
    <div class="qus_list_content">
      <div
        v-for="item in list"
        :key="item.id"
        class="link"
        @click="redirectTo(item)"
      >
        <img v-if="item.category.kind === 'Video'" src="@/assets/video.png">{{ item.title }}
      </div>
    </div>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[25, 50, 100]"
      :page-size="size"
      layout="total, ->, prev, pager, next"
      :total="totalElements"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { search } from '@/api/help_center.js'
export default {
  props: {
    blurry: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentPage: 0,
      size: 25,
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      list: [],
      totalElements: null,
      page: 1
    }
  },
  watch: {
    currentPage() {
      this.fetch()
    },
    size() {
      this.fetch()
    },
    blurry(newValue) {
      if (newValue) {
        this.fetch()
      }
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    fetch() {
      search({ blurry: this.blurry, ...{ page: this.currentPage - 1, size: this.size }}).then(response => {
        this.list = response.content
        this.totalElements = response.totalElements
      })
    },
    handleSizeChange(val) {
      this.size = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    redirectTo(item) {
      if (item.category.kind === 'Video') {
        this.$emit('redneTemplate', 'help_center_video')
        this.$emit('getVideo', item)
      } else {
        this.$emit('redneTemplate', 'help_center_article')
        this.$emit('getArticle', { id: item.id, categoryId: item.category.id })
      }
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
