<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-heading">
        <el-button type="success" @click="crud.toAdd">
          <i class="fa fa-plus" /> 添加原材料
        </el-button>
      </div>
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <TotalPage />
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column label="编号" />
            <el-table-column label="图片" />
            <el-table-column label="名称" />
            <el-table-column label="供应商" />
            <el-table-column label="操作" />
          </el-table>
          <pagination />
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="660px"
    >
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图片" prop="name">
          <el-button type="success"><i class="fa fa-plus" /> 添加图片</el-button>
        </el-form-item>
        <el-form-item label="编号" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="供应商" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        <el-button @click="crud.cancelCU">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tab from '@/components/Tabs/product'
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
const defaultForm = {}
export default {
  components: {
    tab,
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '原材料', url: '/lmp/admin/api/products' })
  },

  data() {
    return {
      rules: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '产品列表', path: { name: 'ProductIndex' }},
      { title: '产品列表', path: { name: 'ProductShow', params: { id: 1 }}},
      { title: '产品原材料' }
    ])
    this.crud.refresh()
  }
}
</script>
