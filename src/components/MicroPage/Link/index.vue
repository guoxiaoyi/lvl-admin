<template>
  <div>
    <div v-if="item.link_type">
      <span @click="modal.show = true"> {{ item.link_type | typeName }} | {{ item.link_name }}</span>
      <span style="margin-left: 5px" @click="setValue"> <i class="el-icon-circle-close" /></span>
    </div>
    <div v-else @click="modal.show = true">请选择</div>
    <el-dialog
      v-if="modal.show"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.show"
      width="800px"
      top="10vh"
    >
      <div slot="title">
        <div class="tabs-nav">
          <div>
            <span class="tab" :class="{active: panel === 'MicroPage'}" @click="panel = 'MicroPage'">微页面</span>
            <span class="tab" :class="{active: panel === 'Goods'}" @click="panel = 'Goods'">商品</span>
            <span class="tab" :class="{active: panel === 'Group'}" @click="panel = 'Group'">商品分组</span>
            <span class="tab" :class="{active: panel === 'Custom'}" @click="panel = 'Custom'">自定义链接</span>
          </div>
          <div v-if="['MicroPage', 'Goods'].includes(panel)" class="form-search" style="display: block;">
            <input v-model="keywords" type="text">
            <button @click="search">搜索</button>
          </div>
        </div>
      </div>
      <component :is="panel" v-if="modal.show" ref="panel" :form="form" />
      <div slot="footer" class="text-center" style="padding: 10px 0;">
        <el-button type="success" @click="submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MicroPage from './MicroPage.vue'
import Group from './Group.vue'
import Goods from './Goods.vue'
import Custom from './Custom.vue'
export default {
  filters: {
    typeName(type) {
      return { microPage: '微页面', customLink: '自定义链接', product: '商品', productCategory: '商品分组' }[type]
    }
  },
  components: { MicroPage, Group, Goods, Custom },
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          url: null,
          link_type: null,
          link_name: null
        }
      }
    }
  },
  data() {
    return {
      modal: { show: false },
      panel: 'MicroPage',
      keywords: null,
      form: {
        id: null,
        url: null,
        link_type: 'microPage',
        link_name: null
      }
    }
  },
  watch: {
    panel(newValue) {
      this.form.link_type = { MicroPage: 'microPage', Goods: 'product', Group: 'productCategory', Custom: 'customLink' }[newValue]
      this.form.id = null
    },
    'modal.show'(newValue) {
      if (!newValue) {
        this.panel = 'MicroPage'
        this.form = {
          id: null,
          url: null,
          link_type: 'microPage',
          link_name: null
        }
      }
    }
  },
  methods: {
    search() {
      this.$refs.panel.crud.query.title = this.keywords
      this.$refs.panel.crud.toQuery()
    },
    submit() {
      switch (this.form.link_type) {
        case 'customLink':
          if (!this.form.url) {
            this.$message.error('链接不能为空')
            return
          }
          break
        default:
          if (!this.form.id) {
            this.$message.error('链接不能为空')
            return
          }
          break
      }
      this.setValue({ ...this.form })
      this.modal.show = false
    },
    setValue({ link_name = null, link_type = null, url = null }) {
      this.item.link_name = link_name
      this.item.link_type = link_type
      this.item.url = url
    },
    handleItemMethod(methodName) {
      // 检查方法是否存在
      if (!this.item[methodName]) {
        // 如果不存在，则添加默认方法
        this.item[methodName] = null
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.tabs-nav {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 30px;
  .tab {
    color: #646566;
    position: relative;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    padding: 0px 16px;
    display: inline-block;
    &.active {
      &:after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: 0;
        width: 100%;
        border-bottom: 2px solid #F34541;
      }
    }
  }
  .form-search {
    width: 240px;
    height: 30px;
    position: relative;
    input[type='text'] {
      border: 1px solid #bbb;
      color: #333;
      font-size: 12px;
      border-radius: 2px;
      padding: 0 20px 0 10px;
      height: 30px;
      outline: 0;
      width: 190px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
    button {
      width: 50px;
      height: 30px;
      position: absolute;
      right: 0;
      top: 0;
      font-size: 12px;
      border-radius: 2px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      font-family: inherit;
      border: 1px solid #F34541;
      text-align: center;
      vertical-align: middle;
      box-sizing: border-box;
      cursor: pointer;
      transition: all .3s;
      background: #F34541;
      color: #FFF;
    }
  }
}
</style>
