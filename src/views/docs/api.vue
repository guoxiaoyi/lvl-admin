<template>
  <div class="app-wrapper">
    <navbar />
    <div class="container">
      <div style="width: 250px">
        <div class="menu" :style="{ top: menuTop + 'px' }">
          <ul>
            <li v-for="item in headings" :key="item.id">
              <a @click.prevent="scrollTo(item.id)">{{ item.text }}</a>
              <ul v-if="item.children">
                <li v-for="child in item.children" :key="child.id">
                  <a @click.prevent="scrollTo(child.id)">{{ child.text }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="content">
        <vue-markdown :source="markdownContent" />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/layout/components/Navbar.vue'
import VueMarkdown from 'vue-markdown'
import docs from '@/api/docs'
export default {
  components: {
    Navbar,
    VueMarkdown
  },
  data() {
    return {
      markdownContent: '', // 这里将是您的 Markdown 内容
      headings: []
    }
  },
  computed: {
    menuTop() {
      const navbarHeight = 42 // `navbar` 组件的高度
      const scrollTop = window.scrollY // 当前滚动位置
      return Math.max(navbarHeight - scrollTop, 0) // 计算菜单的 top 值
    }
  },
  mounted() {
    this.loadMarkdown()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    loadMarkdown() {
      // 从文件加载 Markdown 内容
      docs.api().then(({ data }) => {
        this.markdownContent = data
        this.$nextTick(this.extractHeadings)
      })
    },
    extractHeadings() {
      this.headings = []
      const contentEl = this.$el.querySelector('.content')
      if (!contentEl) return

      let currentH2Item = null
      const headings = contentEl.querySelectorAll('h2, h3')
      headings.forEach(heading => {
        const simplifiedText = heading.innerText.replace(/\s+/g, '-').toLowerCase()
        heading.id = simplifiedText

        if (heading.tagName === 'H2') {
          currentH2Item = { id: simplifiedText, text: heading.innerText, children: [] }
          this.headings.push(currentH2Item)
        } else if (heading.tagName === 'H3' && currentH2Item) {
          currentH2Item.children.push({ id: simplifiedText, text: heading.innerText })
        }
      })
    },
    scrollTo(id) {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
    handleScroll() {
      const navbarHeight = 42 // `navbar` 组件的高度
      const scrollTop = window.scrollY // 当前滚动位置
      const menuElement = this.$el.querySelector('.menu') // 获取菜单元素
      if (menuElement) {
        const newTop = Math.max(navbarHeight - scrollTop, 0)
        menuElement.style.top = newTop + 'px' // 动态调整菜单的 top 值
        menuElement.style.height = `calc(100vh - ${newTop}px)`

        if (newTop === 0) {
          menuElement.classList.add('fixed')
        } else {
          menuElement.classList.remove('fixed')
        }
      }
    }
  }
}

</script>

<style lang="scss" scoped>
$primaryColor: #333;
$secondaryColor: #4a4a4a;
$backgroundColor: #f7f7f7;
$borderColor: #ddd;
$codeBackgroundColor: #f3f3f3;
$menuPrimaryColor: #333;
$menuSecondaryColor: #666666;
$menuBackgroundColor: #f7f7f7;
$menuBorderColor: #ddd;

.container {
  display: flex;
  font-family: 'Roboto', sans-serif;
}

.menu {
  &.fixed {
    position: fixed;
  }
  width: 250px;
  top: 42px;
  left: 0;
  height: calc(100vh - 42px);
  overflow-y: scroll; // 允许垂直滚动

  // 隐藏滚动条的通用样式
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; // Internet Explorer 10+

  &::-webkit-scrollbar {
    display: none; // Chrome, Safari, Opera
  }
  background-color: $menuBackgroundColor;
  border-right: 1px solid $menuBorderColor;
  padding: 20px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    text-decoration: none;
    display: block;
    color: $menuPrimaryColor;

    &:hover {
      text-decoration: underline;
    }
  }

  // 二级标题样式
  > ul > li {
    > ul {
      margin-top: 10px;
    }
    > a {
      font-weight: bold;
      font-size: 16px;
    }
  }

  // 三级标题样式
  ul ul a {
    font-size: 14px;
    padding-left: 15px;
    color: $menuSecondaryColor;
  }
}

.content {
  flex: 1;
  // margin-left: 250px; // 为左侧菜单留出空间
  padding: 20px;
  overflow-y: auto;
  ::v-deep {
    h2 {
      color: $primaryColor;
    }

    h3 {
      color: $secondaryColor;
    }

    pre {
      display: block;
      padding: 9.5px;
      margin: 0 0 10px;
      font-size: 13px;
      line-height: 1.428571429;
      word-break: break-all;
      word-wrap: break-word;
      color: #333333;
      background-color: #f5f5f5;
      border: 1px solid #ccc;
      border-radius: 4px;
      code {
        padding: 0;
        font-size: inherit;
        color: inherit;
        white-space: pre-wrap;
        background-color: transparent;
        border-radius: 0;
      }
      // 可以根据需要继续添加更多
    }
    code {
      padding: 2px 4px;
      font-size: 90%;
      color: #c7254e;
      background-color: #f9f2f4;
      border-radius: 4px;
      }
    table {
      width: 100%; // 表格宽度
      border-collapse: collapse; // 边框合并
      margin: 20px 0; // 表格外边距

      th, td {
        border: 1px solid #ddd; // 单元格边框
        padding: 8px; // 单元格内边距
        text-align: left; // 文本对齐方式
      }

      th {
        background-color: #f2f2f2; // 表头背景色
        color: #333; // 表头文本颜色
      }

      tr:nth-child(even) {
        background-color: #f9f9f9; // 交替行背景色
      }

      tr:hover {
        background-color: #f1f1f1; // 鼠标悬停行背景色
      }
    }
  }
}

</style>
