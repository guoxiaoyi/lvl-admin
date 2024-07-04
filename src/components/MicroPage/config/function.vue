<template>
  <div class="compontent-btn-wrapper" :class="className">
    <h4>添加组件</h4>
    <el-row :gutter="5">
      <el-col v-for="item in functions" :key="item.key" :span="8">
        <span @click="add(item.key)">{{ item.name }}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  inject: ['_micro_page_edit_vm'],
  props: {
    className: {
      type: Array,
      default: () => { return [] }
    },
    position: {
      type: String,
      default: 'end'
    }
  },
  data() {
    return {
      functions: [
        { name: '图片广告', key: 'image' },
        { name: '富文本', key: 'rich_text' },
        { name: '商品与分组', key: 'goods_group' },
        { name: '幻灯片', key: 'swiper_margin' },
        { name: '图文导航', key: 'img_navigator' },
        { name: '标题栏', key: 'page_title' },
        { name: '搜索', key: 'search' },
        { name: '视频', key: 'video' },
        { name: '公告', key: 'notice' },
        { name: '表单', key: 'form' }
      ]
    }
  },
  methods: {
    add(key) {
      console.log(key)
      // { image_id: null, image_url: null, link_name: null, link_type: null, text: null, url: null }
      const defaultForm = {
        image: { image_id: null, image_url: null, link_name: null, link_type: null },
        rich_text: { html: null },
        goods_group: { group_id: '', group_name: '', style: 'group', items: {}},
        swiper_margin: [],
        img_navigator: [
          { image_id: null, image_url: null, link_name: null, link_type: null, title: '导航1', url: null },
          { image_id: null, image_url: null, link_name: null, link_type: null, title: '导航2', url: null },
          { image_id: null, image_url: null, link_name: null, link_type: null, title: '导航3', url: null }
        ],
        page_title: [{ align: 'left', title: null, url: null }],
        video: { html: null, kind: 'iframe', video_cover: null, video_id: null },
        notice: [{ bg_color: '#FFF', content: null, font_color: '#333' }],
        search: '',
        form: []
      }
      switch (this.position) {
        case 'end':
          this._micro_page_edit_vm.content.push({ block: key, data: defaultForm[key] })
          break
        case 'prev':
          this._micro_page_edit_vm.content.splice(this._micro_page_edit_vm.current, 0, { block: key, data: defaultForm[key] })
          break
        case 'next':
          this._micro_page_edit_vm.content.splice(this._micro_page_edit_vm.current + 1, 0, { block: key, data: defaultForm[key] })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .compontent-btn-wrapper {
    border-top: 1px solid #e5e5e5;
    display: flex;
    flex-wrap: wrap;
    padding: 15px 10px 15px 10px;
    h4 {
      display: block;
      width: 100%;
      margin-top: 0;
      font-weight: normal;
      color: #666;
      font-size: 14px;
      flex-wrap: wrap;
    }
    span {
      display: block;
      text-align: center;
      height: 30px;
      text-align: center;
      margin-bottom: 5px;
      border: 1px dashed #e5e5e5;
      background: #f8f8f8;
      font-size: 12px;
      line-height: 30px;
      color: #666;
      cursor: pointer;
    }
  }
</style>
