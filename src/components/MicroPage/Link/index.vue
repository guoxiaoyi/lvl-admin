<template>
  <el-dialog
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
    <div slot="footer" class="text-center" style="padding: 10px 0;">
      <el-button type="success">确定</el-button>
    </div>

    <component :is="panel" ref="panel" />
  </el-dialog>
</template>

<script>
import MicroPage from './MicroPage.vue'
import Group from './Group.vue'
import Goods from './Goods.vue'
import Custom from './Custom.vue'
export default {
  components: {
    MicroPage,
    Group,
    Goods,
    Custom
  },
  props: {
    modal: {
      type: Object,
      default: () => {
        return {
          show: false
        }
      }
    }
  },
  data() {
    return {
      panel: 'MicroPage',
      keywords: null
    }
  },
  methods: {
    search() {
      this.$refs.panel.crud.query.title = this.keywords
      this.$refs.panel.crud.toQuery()
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
