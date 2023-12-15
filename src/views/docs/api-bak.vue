<template>
  <div class="flex">
    <div class="menu col-3">
      <ul>
        <li v-for="heading in titles" :key="heading.title">
          <a :name="`${heading.title}`">{{ heading.title }}</a>
          <ul>
            <li v-for="subtitle in heading.children" :key="subtitle">
              
              <a :name="`${subtitle}`">{{ subtitle }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="col-9">
      <vue-markdown :source="markdownContent" />
    </div>
  </div>
</template>

<script>
import docs from '@/api/docs'
import VueMarkdown from 'vue-markdown'
export default {
  components: {
    VueMarkdown
  },
  data() {
    return {
      markdownContent: '',
      titles: []
    }
  },

  mounted() {
    this.loadMarkdownFile()
  },
  methods: {
    async loadMarkdownFile() {
      docs.api().then(({ data }) => {
        this.markdownContent = this.addAnchorsToMarkdown(data)
        this.titles = this.extractMarkdownTitles(data)
      })
    },
    extractMarkdownTitles(markdownString) {
      const lines = markdownString.split('\n')
      const tree = []
      let currentHeading = null

      lines.forEach(line => {
        if (line.startsWith('## ')) {
          if (currentHeading) {
            tree.push(currentHeading)
          }
          currentHeading = { title: line.substring(3).trim(), children: [] } // 移除前面的 `## `
        } else if (line.startsWith('### ') && currentHeading) {
          currentHeading.children.push(line.substring(4).trim()) // 移除前面的 `### `
        }
      })

      if (currentHeading) {
        tree.push(currentHeading)
      }
      console.log(JSON.stringify(tree, null, 2))
      return tree
    },
    addAnchorsToMarkdown(mdContent) {
      // 匹配所有二级和三级标题
      const titleRegex = /(##+)(\s)(.+)/g;

      // 替换函数，为每个标题添加锚点
      return mdContent.replace(titleRegex, (match, hashes, space, title) => {
        // 生成锚点ID
        const id = title.toLowerCase().replace(/\s+/g, '-');

        // 返回修改后的标题行
        return `${hashes}${space}[${title}](#${id})`;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.menu {
  height: 100vh;
}
</style>
