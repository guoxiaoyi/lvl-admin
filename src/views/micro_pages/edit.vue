<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> {{ $route.name === 'MicroPageEdit' ? '编辑' : '新建' }}微页面 </a>
      </li>
    </ul>
    <div class="panel panel-default micro_page_wrapper">
      <div class="panel-body">
        <div class="page_container">
          <div class="page-header" :class="[ current === 'title' && 'current']" @click="select('title')">
            <component :is="micro_page_component_name(title.block)" :index="'title'">
              <template slot="config">
                <page-config v-if="current === 'title'" :data="configTitle[micro_page_component_name('title')]" :config-type="configType" />
              </template>
            </component>
          </div>
          <draggable v-model="content" filter=".header" handle=".after" style="min-height: 300px;" @start="drag = true;" @end="draggableEnd">
            <div v-for="(item, index) in content" :key="index" :ref="'t_'+(index)" class="wrapper-item" :class="[index === current && 'current', item.block ]">
              <component :is="micro_page_component_name(item.block)" :index="index">
                <template slot="config">
                  <page-config v-if="current === index && configType === 'micro-page-editor'" :data="configTitle[micro_page_component_name(item.block)] || {}" :config-type="configType" />
                </template>
                <template slot="functionBtn">
                  <FunctionPage v-if="current === index && configType === 'compontent-btn-wrapper'" :class-name="[FunctionPosition]" :position="FunctionPosition" />
                </template>
              </component>
              <div class="after" @click="select(index)" />
              <span class="wrapper-control add" data-position="prev" @click="add(index, 'prev')" />
              <span class="wrapper-control add" data-position="next" @click="add(index, 'next')" />
              <span class="wrapper-control remove" @click="remove(index)" />
            </div>
          </draggable>
          <FunctionPage />
        </div>
      </div>
    </div>
    <div class="micro_page_button_wrapper">
      <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
      <el-button v-if="$route.name !== 'MicroPageDup'" :type="published ? '' : 'success'" :loading="submitting" @click="submit(!published)">{{ published === true ? '取消' : '' }}发布</el-button>
      <el-button v-if="['MicroPageEdit'].includes($route.name)" @click="preview">预览</el-button>
    </div>
    <el-dialog
      width="920px"
      title="预览"
      append-to-body
      :visible.sync="modal.preview"
      top="8vh"
    >
      <div class="flex">
        <div class="phone-frame" style="margin: 0 auto;">
          <iframe id="previewer" :src="modal.url+'/demo'" />
        </div>
        <div class="home_page_edit">
          <div class="panel panel-default">
            <div class="panel-body">
              <h4>微页面链接</h4>
              <div v-if="!published">
                当前微页面未发布，发布后可复制链接并查看二维码。
              </div>
              <div v-else>
                <el-input ref="copyUrl" v-model="modal.url" type="textarea" style="opacity: 0;position: absolute; left: 0; top:0; width: 10px;height: 10px;z-index: -1;" :rows="20" resize="none" />
                <el-input v-model="modal.url" :disabled="true">
                  <template slot="append"><el-button type="success" @click="copyClicked">复制</el-button></template>
                </el-input>
                <p style="margin-top: 20px;">
                  <VueQr ref="Qrcode" :text="modal.url" class="img-thumbnail" :size="150" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import micro_page from '@/api/micro_page'
import FunctionPage from '@/components/MicroPage/config/function.vue'
import PageConfig from '@/components/MicroPage/config'
import PageHeader from '@/components/MicroPage/template/page_header.vue'
import { micro_page_component_name } from '@/utils'
import { mapGetters } from 'vuex'
import VueQr from 'vue-qr'
import draggable from 'vuedraggable'
import goods from '@/components/MicroPage/template/goods.vue'
import navigator from '@/components/MicroPage/template/navigator.vue'
import notice from '@/components/MicroPage/template/notice.vue'
import page_image from '@/components/MicroPage/template/page_image.vue'
import page_title from '@/components/MicroPage/template/page_title.vue'
import page_video from '@/components/MicroPage/template/page_video.vue'
import rich_text from '@/components/MicroPage/template/rich_text.vue'
import search from '@/components/MicroPage/template/search.vue'
import swiper from '@/components/MicroPage/template/swiper.vue'
import MicroPage from '@/components/MicroPage/Link/MicroPage.vue'
import { validates, required, str2Object } from '@/utils/micro_page'
export default {
  provide() {
    return {
      _micro_page_edit_vm: this
    }
  },
  components: {
    draggable,
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
    swiper,
    MicroPage,
    PageConfig,
    VueQr
  },
  data() {
    return {
      content: [],
      title: {},
      current: null,
      drag: false,
      micro_page_component_name,
      link: {
        link_name: null,
        link_type: null,
        url: null
      },
      FunctionPosition: 'prev',
      ItemPosition: null,
      configType: null,
      configTitle: {
        PageHeader: { title: '页面标题', key: 'page_header' },
        goods: { title: '添加商品分组', key: 'goods', hint: '提示: 分组最多可添加6个' },
        navigator: { title: '图文导航', key: 'navigator', hint: '提示: 图文导航最多可添加5个, 拖动组件可排序' },
        notice: { title: '公告', key: 'notice' },
        page_image: { title: '图片', key: 'page_image' },
        page_title: { title: '标题栏', key: 'page_title' },
        page_video: { title: '添加视频', key: 'page_video' },
        rich_text: { title: '富文本', key: 'rich_text' },
        swiper: { title: '幻灯片', key: 'swiper', hint: '提示: 幻灯片最多可添加8个, 拖动组件可排序' }
      },
      submitting: false,
      published: false,
      modal: {
        preview: false,
        url: ''
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {
    content: {
      handler: function() {},
      deep: true
    }
  },
  mounted() {
    if (['MicroPageDup', 'MicroPageNew'].includes(this.$route.name)) {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '新建微页面' }])
    } else {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '微页面列表', path: { name: 'MicroPages' }}, { title: '编辑微页面' }])
    }
    if (['MicroPageDup', 'MicroPageEdit'].includes(this.$route.name)) {
      micro_page.show(this.$route.params).then(({ data }) => {
        if (this.$route.name === 'MicroPageEdit') {
          this.published = data.published
        }
        this.modal.url = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/v2/micro_pages/${this.$route.params.id}`
        this.content = str2Object(data.content).content
        this.title = str2Object(data.content).title
      })
    } else {
      if (this.$route.query.template) {
        micro_page.templates().then(({ data }) => {
          this.content = str2Object(JSON.stringify(data[this.$route.query.template]['content'])).content
          this.title = str2Object(JSON.stringify(data[this.$route.query.template]['content'])).title
        })
      }
      this.title = { block: 'title', data: { title: null }}
    }
  },
  beforeDestroy() {
    window.onbeforeunload = null
  },
  methods: {
    submit(b) {
      const form = {}
      const datas = [].concat(this.content)
      const validate = validates(datas)
      if (required(this.title.data.title)) {
        this.$message.error('标题不能为空')
        this.select('title')
        return
      }
      if (validate.length > 0) {
        validate.forEach((item, index) => {
          if (index === 0) {
            this.select((Number(item.error_dom)))
            this.$refs[`t_${(Number(item.error_dom))}`][0].scrollIntoView({
              block: 'center',
              behavior: 'smooth'
            })
          }
          setTimeout(() => {
            this.$message.error(item.text)
          }, index * 100)
        })
      } else {
        const content = {}
        datas.concat(this.title).forEach((el, index) => {
          if (['swiper', 'swiper_margin', 'img_navigator_small', 'img_navigator', 'page_title', 'notice'].includes(el.block)) {
            const $d = {}
            el.data.forEach((d, i) => {
              $d[i] = d
            })
            content[index] = { block: el.block, data: $d }
          } else {
            content[index] = el
          }
        })

        const action = ['MicroPageDup', 'MicroPageNew'].includes(this.$route.name) ? 'add' : 'edit'
        this.submitting = true
        if (this.$route.name === 'MicroPageEdit') {
          form.id = this.$route.params.id
        }
        if (b === true || b === false) {
          form.published = b
        } else {
          form.published = this.published
        }
        form.content = JSON.stringify(content)
        micro_page[action](form).then(response => {
          if (['MicroPageDup', 'MicroPageNew'].includes(this.$route.name)) {
            this.$router.push({ name: 'MicroPageEdit', params: { id: response.data.id }})
          } else {
            // this.$router.push({ name: 'RankingListEdit', params: { id: this.$route.params.id }})
            window.onbeforeunload = function(e) {
              window.onbeforeunload = null
            }
            window.location.reload()
          }
          this.submitting = false
          this.$message.success(`${action === 'edit' ? '更新' : '创建'}成功`)
        }).catch(fail => {
          this.submitting = false
          if (b === true || b === false) {
            form.published = !b
            this.published = !b
          }
        })
      }
    },
    preview() {
      this.modal.preview = true
    },
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    },
    select(index) {
      this.current = index
      this.configType = 'micro-page-editor'
      window.onbeforeunload = function(e) {
        e = e || window.event
        // 兼容IE8和Firefox 4之前的版本
        if (e) {
          e.returnValue = '页面还有没有保存的更改，确定不保存离开当前页面吗？'
        }
        // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        return '页面还有没有保存的更改，确定不保存离开当前页面吗？'
      }
    },
    draggableEnd(val) {
      this.drag = false
      this.current = val.newIndex
    },
    remove(index) {
      this.$confirm('确定删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.content.splice(index, 1)
      }).catch(() => {})
    },
    add(index, position) {
      this.FunctionPosition = position
      this.current = index
      this.configType = 'compontent-btn-wrapper'
      console.log(this.configType)
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
    .wrapper-item, .page-header {
      position: relative;
      &.title {
        pointer-events: none;
      }
      .wrapper-control {
        cursor: pointer;
        width: 16px;
        height: 16px;
        position: absolute;
        z-index: 2;
        background-color: #F34541;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 50%;
        border-radius: 50%;
        line-height: 16px;
        text-align: center;
        display: none;
        &.add {
          left: 50%;
          margin-left: -7px;
          background-image: url('~@/assets/add_white.png');
          &[data-position='prev'] {
            top: -8px;
          }
          &[data-position='next'] {
            bottom: -8px;
          }
        }
        &.remove {
          background-image: url('~@/assets/remove.png');
          background-size: 35%;
          right: -8px;
          top: -8px;
          background-color: #999;
        }
      }
      .after {
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top:0;
        left: 0;
      }
      &:hover, &.current {
        position: relative;
        .wrapper-control {
          display: block;
        }
        .after {
          border: 1px dashed #F34541;
        }
      }
    }
    .micro-page-editor, .wrapper-item .compontent-btn-wrapper {
      cursor: auto;
      position: absolute;
      left: 100%;
      padding: 15px;
      min-height: 40px;
      border-radius: 5px;
      border: 1px solid #e5e5e5;
      margin-left: 20px;
      font-size: 12px;
      z-index: 4;
      &:before, &:after{
        right: 100%;
        border: solid transparent;
        content: " ";
        height: 0px;
        width: 0;
        position: absolute;
        pointer-events: none;
      }
      &:before{
        border-color: transparent;
        border-right-color: #e5e5e5;
        border-width: 7px;
        margin-top: -7px;
      }
      &:after{
        border-color: transparent;
        border-width: 6px;
        margin-top: -6px;
      }
      .title {
        font-size: 14px;
        border-bottom: 1px solid #e5e5e5;
        line-height: 24px;
        height: 24px;
        margin-bottom: 10px;
        font-weight: bold;
        span {
          font-size: 12px;
          font-weight: normal;
          color: #666;
          margin-left: 10px;
          i {
            font-size: 14px;
            margin-top: -3px;
            margin-right: 3px;
            vertical-align: middle;
          }
        }
      }
    }
    .micro-page-editor {
      width: 560px;
      background: #f8f8f8;
      top: 0;
      &:after {
        top: 15px;
        border-right-color: #f8f8f8;
      }
    }
    .wrapper-item .compontent-btn-wrapper{
      width: 350px;
      background: #FFF;
      &.prev{
        top: 0;
        &:before, &:after{
          top: 20px;
        }
      }
      &.next{
        bottom: 0;
        &:before, &:after{
          bottom: 20px;
        }
        &:after{
          margin-bottom: 1px;
        }
      }
      &:after{
        border-right-color: #FFF;
      }
    }
    .default-template {
      display: flex;
      height: 136px;
      align-items: center;
      justify-content: center;
      background-color: #ebf8fd;
      text-align: center;
      color: #88c4dc;
      flex-direction: column;
    }
  }
  .micro_page_wrapper {
    padding-bottom: 70px;
  }
  .micro_page_button_wrapper {
    position: fixed;
    bottom: 0px;
    z-index: 2;
    width: 100%;
    padding-top: 15px;
    padding-bottom: 15px;
    background: #FBFBFB;
    border-top: 1px solid #eee;
    padding-left: 114px;
  }
  .home_page_edit {
    width: 400px;
    margin-left: 20px;
    .well {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 20px;
      padding: 19px;
      margin-bottom: 0px;
      background-color: #F5F5F5;
      border: 1px solid #ededed;
      border-radius: 4px;
    }
  }
</style>
