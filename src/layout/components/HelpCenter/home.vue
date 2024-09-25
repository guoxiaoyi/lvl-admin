<template>
  <div>
    <el-tree
      v-if="!loading"
      :props="props"
      :load="loadNode"
      node-key="id"
      :indent="16"
      lazy
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
import helpCenterApi from '@/api/help_center.js'

export default {
  props: {
    sss: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      props: {
        label: 'title',
        children: 'children',
        isLeaf: 'leaf'
      },
      categoryList: [],
      videoList: [],
      loading: true
    }
  },
  async mounted() {
    Promise.all([
      helpCenterApi.category(),
      helpCenterApi.getVideoList()
    ]).then(response => {
      this.categoryList = response[0].map(element => {
        return {
          id: element.id,
          kind: element.kind,
          title: element.name,
          leaf: false,
          children: element.children
        }
      })
      const videos = {}
      response[1].forEach(element => {
        videos.id = element.category.id
        videos.kind = element.category.kind
        videos.title = element.category.name
        videos.leaf = false
        videos.children = []
      })
      this.videoList = response[1]
      this.categoryList.push(videos)
      this.loading = false
      this.$emit('treeLoaded')
    })
  },
  methods: {
    async loadNode(node, resolve) {
      console.log(node)
      if (node.level === 0) {
        return resolve(this.categoryList)
      }
      if (node.level >= 1) {
        if (node.data.kind === 'Video') {
          const childrens = this.videoList.filter(element => element.category.id === node.data.id)
          return resolve(childrens[0].article.map(item => {
            return {
              categoryId: node.data.id,
              id: item.id,
              title: item.title,
              leaf: true,
              kind: 'video'
            }
          }))
        } else {
          const data = await helpCenterApi.getArticleList({ categoryId: node.data.id })
          const childrens = data.content.map(element => {
            return {
              id: element.id,
              categoryId: node.data.id,
              title: element.title,
              leaf: true,
              kind: 'article'
            }
          })
          return resolve(this.categoryList.find(item => item.id === node.data.id).children.concat(childrens))
        }
      }
    },
    handleNodeClick(data) {
      if (data.kind === 'article') {
        this.getArticle(data)
      }
      if (data.kind === 'video') {
        this.getVideo(data)
      }
    },
    getVideo(data) {
      this.$emit('redneTemplate', 'help_center_video')
      this.$emit('getVideo', data)
    },
    getArticle(data) {
      this.$emit('redneTemplate', 'help_center_article')
      this.$emit('getArticle', data)
    }
  }

}
</script>

<style lang="scss" scoped>

h3 {
  margin: 10px 0;
  padding: 0;
  margin-top: 0;
}
::v-deep {
  .el-tree-node__content {
    height: 34px;
  }
  .el-tree-node__label {
    font-size: 14px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-tree-node__children {
    .el-tree-node__label {
      font-size: 13px;
      font-weight: normal;
    }
  }
}
.video-title {
  font-size: 16px;
  height: 30px;
  color: #606266;
  padding-left: 18px;
  cursor: pointer;
}
</style>
