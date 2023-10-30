<template>
  <div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show"
      :before-close="handlerClose"
      width="930px"
      title="选择产品"
      top="10vh"
    >
      <div class="list-header">
        <el-form ref="filterForm" :inline="true" size="small" label-width="80px" class="select-product-form" @submit.native.prevent>
          <el-form-item label="产品名称">
            <el-input v-model="query.name" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="crud.toQuery()">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="panel panel-default">
        <list :data="crud.data" :loading="crud.loading">
          <template slot="action" slot-scope="row">
            <slot name="action" :data="row.data" />
          </template>
        </list>
      </div>
      <pagination :size="8" />
    </el-dialog>
  </div>
</template>

<script>

/*
  props:
    show.sync: Boolean    控制组件显示
*/
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/DialogPagination'
import list from './list'
import { mapGetters } from 'vuex'
export default {
  components: { pagination, list },
  mixins: [presenter(), header(), crud()],
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  cruds() {
    return CRUD({ title: '产品列表', url: '/lmp/v2/admin/product', size: 8 })
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    if (this.account.store.productEnabled) {
      this.crud.refresh()
    }
  },
  methods: {
    handlerClose() {
      this.$emit('update:show', false)
    }
  }
}
</script>
<style lang="scss" scoped>

.list-header {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .select-product-form {
    display: flex;
    .el-form-item.el-form-item--small {
      display: inline-flex;
      margin-bottom: 0;
    }
  }
}
</style>
