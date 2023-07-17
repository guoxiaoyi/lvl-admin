<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 新建微页面 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_container">
          <component
            :is="micro_page_component_name(item.block)"
            v-for="(item, index) in content"
            :key="index"
            :index="index"
          />
          <FunctionPage />
        </div>
        <el-button type="success" @click="submit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import micro_page from '@/api/micro_page'
import FunctionPage from '@/components/MicroPage/config/function.vue'
import PageHeader from '@/components/MicroPage/template/page_header.vue'
import { micro_page_component_name } from '@/utils'

import goods from '@/components/MicroPage/template/goods.vue'
import navigator from '@/components/MicroPage/template/navigator.vue'
import notice from '@/components/MicroPage/template/notice.vue'
import page_image from '@/components/MicroPage/template/page_image.vue'
import page_title from '@/components/MicroPage/template/page_title.vue'
import page_video from '@/components/MicroPage/template/page_video.vue'
import rich_text from '@/components/MicroPage/template/rich_text.vue'
import search from '@/components/MicroPage/template/search.vue'
import swiper from '@/components/MicroPage/template/swiper.vue'

export default {
  provide() {
    return {
      _micro_page_edit_vm: this
    }
  },
  components: {
    FunctionPage,
    PageHeader,
    goods,
    navigator,
    notice,
    page_image,
    page_title,
    page_video,
    rich_text,
    search,
    swiper
  },
  data() {
    return {
      content: [],
      current: null,
      micro_page_component_name,
      link: {
        link_name: null,
        link_type: null,
        url: null
      }
    }
  },
  computed: {

  },
  watch: {
    content: {
      handler: function() {},
      deep: true
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '新建微页面' }])
    micro_page.show(this.$route.params).then(({ data }) => {
      Object.values(JSON.parse(data.content)).forEach(item => {
        console.log(item.block, item.data)
        switch (item.block) {
          case 'title':
            this.content.push(item)
            break
          case 'swiper':
            this.content.push({ block: item.block, data: this.transformLink(Object.values(item.data)) })
            break
          case 'swiper_margin':
            this.content.push({ block: item.block, data: this.transformLink(Object.values(item.data)) })
            break
          case 'rich_text':
            this.content.push(item)
            break
          case 'img_navigator_small':
            this.content.push({ block: item.block, data: this.transformLink(Object.values(item.data)) })
            break
          case 'img_navigator':
            this.content.push({ block: item.block, data: this.transformLink(Object.values(item.data)) })
            break
          case 'page_title':
            this.content.push({ block: item.block, data: Object.values(item.data) })
            break
          case 'image':
            this.content.push({ block: item.block, data: this.transformLink(item.data) })
            break
          case 'goods_group_one_column':
            this.content.push({ block: item.block, data: item.data })
            break
          case 'goods_group_img':
            this.content.push({ block: item.block, data: item.data })
            break
          case 'goods_group':
            this.content.push({ block: item.block, data: item.data })
            break
          case 'search':
            this.content.push(item)
            break
          case 'notice':
            this.content.push({ block: item.block, data: Object.values(item.data) })
            break
          case 'video':
            this.content.push(item)
            break
          default:
            break;
        }
      })
    })
  },
  methods: {
    submit() {
      console.log(this.content)
    },
    transformLink(datas) {
      if (Array.isArray(datas)) {
        const d = []
        datas.forEach(i => {
          d.push({ ...this.link, ...i })
        })
        return d
      } else {
        return { ...this.link, ...datas }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

  .page_container {
    width: 320px;
    border: 1px solid #ccc;
    position: relative;
    margin: 40px 100px;
    word-break: keep-all;
    word-wrap: break-word;
  }
  ::v-deep {
    .wrapper-item {
      position: relative;
    }
    .current {
      position: relative;
      &:after {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        border: 1px dashed #F34541;
        top:0;
        left: 0;
      }
    }
  }
</style>
