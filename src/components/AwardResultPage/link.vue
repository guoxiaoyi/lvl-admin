<template>
  <div>
    <div v-if="item.link_type" class="choose-link-menu">
      <span @click="() => { if (disabled) {return } modal.show = true}"> {{ item.link_type | typeName }} | {{ item.link_name }}</span>
      <span class="remove" @click="setValue"> <i class="el-icon-circle-close" /></span>
    </div>
    <div v-else class="choose-link-menu" @click="modal.show = true">请选择</div>
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
            <span class="tab" :class="{active: panel === 'SystemPage'}" @click="panel = 'SystemPage'">系统页面</span>
            <span class="tab" :class="{active: panel === 'MicroProgram'}" @click="panel = 'MicroProgram'">小程序</span>
            <span class="tab" :class="{active: panel === 'Custom'}" @click="panel = 'Custom'">自定义链接</span>
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
import Custom from '@/components/MicroPage/Link/Custom.vue'
import MicroProgram from './MicroProgram.vue'
import SystemPage from './SystemPage.vue'
import { mapGetters } from 'vuex'
export default {
  filters: {
    typeName(type) {
      return { systemPage: '系统页面', customLink: '自定义链接', microProgram: '小程序' }[type]
    }
  },
  components: { MicroProgram, SystemPage, Custom },
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: { show: false },
      panel: 'SystemPage',
      keywords: null,
      form: {
        id: null,
        url: null,
        link_type: 'systemPage',
        link_name: null
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {
    panel(newValue) {
      this.form.link_type = { SystemPage: 'systemPage', MicroProgram: 'microProgram', Custom: 'customLink' }[newValue]
      this.form.id = null
    },
    'modal.show'(newValue) {
      if (!newValue) {
        this.panel = 'SystemPage'
        this.form = {
          id: null,
          url: null,
          link_type: 'systemPage',
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
        case 'systemPage':
          if (!this.form.id) {
            this.$message.error('请选择页面')
            return
          }
          break
        case 'microProgram':
          if (!this.form.url) {
            this.$message.error('路径不能为空')
            return
          }
          if (!this.form.id) {
            this.$message.error('跳转类型不能为空')
            return
          }
          break
      }
      this.setValue({ ...this.form })
      this.modal.show = false
    },
    setValue({ link_name = null, link_type = null, url = null, id = null }) {
      if (this.disabled) {
        return
      }
      this.item.link_name = link_name
      this.item.link_type = link_type
      this.item.url = url
      this.item.id = id
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
.choose-link-menu {
  color: #155bd4;
  width: 316px;
  height: 32px;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 32px;
  &:hover {
    .remove {
      display: inline;
    }
  }
  .remove {
    margin-left: 5px;
    display: none;
  }
}
</style>
