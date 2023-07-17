<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-heading">
        <el-button type="success" :disabled="crud.page.total >= 20" @click="crud.toAdd">
          <i class="fa fa-plus" /> 新建批次
        </el-button>
        <i class="fa fa-info-circle" style="margin: 0px 3px;" /> 新建批次前，建议先完善产品原材料信息
      </div>
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column label="创建时间" />
            <el-table-column label="产品批次" />
            <el-table-column label="生产时间" />
            <el-table-column label="操作" />
          </el-table>
        </div>
        <pagination />
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
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="产品" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="产品批次" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="生产日期" prop="name">
          <el-date-picker
            v-model="form.producedDate"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <h5>原料批次</h5>
        <hr>
        <el-form-item label="产品批次" prop="name">
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
    return CRUD({ title: '产品列表', url: '/lmp/admin/api/products' })
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
      { title: '产品批次管理' }
    ])
    this.crud.refresh()
  }
}
</script>
<style>
h5 {
  color: #000
}
</style>
