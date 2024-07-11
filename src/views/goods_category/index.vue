<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 商品分类 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline" @submit.native.prevent>
            <el-form-item label="分类名称">
              <el-input v-model="query.name" />
            </el-form-item>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="分类名称" prop="name" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="crud.toEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="660px"
    >
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="20" show-word-limit />
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
import CRUD, { presenter, header, crud, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import { mapGetters } from 'vuex'
import goods_categories from '@/api/goods_categories.js'
const defaultForm = { id: null, name: null }
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '商品分类', url: '/lmp/v2/admin/good_category', crudMethod: { ...goods_categories }})
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: `请填写名称`, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activeButton'
    ])
  },
  watch: {
    'activeButton.show'() {
      if (this.activeButton.show && this.activeButton.action === 'create_goods_group') {
        this.crud.toAdd()
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '商品分类' }
    ])
    this.crud.refresh()
  },
  methods: {
    [CRUD.HOOK.afterAddCancel]() {
      this.init_button()
    },
    [CRUD.HOOK.afterSubmit]() {
      this.init_button()
    },
    init_button() {
      this.$store.dispatch('breadcrumb/set_active__button', { ...this.activeButton, show: false })
    }
  }

}
</script>

<style>

</style>
