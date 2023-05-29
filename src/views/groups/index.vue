<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          商品分组
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-info" role="alert">
          方便客户更快捷的找到自己想要的商品，将商品按照不同的类别进行分组。<br>1、 微页面组件中引用分组；<br>2、 一个商品支持挂在单个或多个分组。
        </div>
        <div class="panel panel-default table-responsive">
          <TotalPage />
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="分组名称">
              <template slot-scope="scope">
                <router-link :to="{ name: 'GroupGrouping', params: { id: scope.row.id }}">{{scope.row.name}}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="商品数" prop="goodsCount" />
            <el-table-column label="备注" prop="note" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link :to="{ name: 'GroupGrouping', params: { id: scope.row.id }}">
                  商品列表
                </router-link>
                <span v-if="checkPer(['store_good_manage'])">
                  -
                  <el-button type="text" @click="crud.toEdit(scope.row)">修改</el-button>
                </span>
                <span v-if="checkPer(['store_good_manage'])">-</span>
                <el-button v-if="checkPer(['store_good_manage'])" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
        <el-form-item label="说明" prop="note">
          <el-input v-model="form.note" type="textarea" maxlength="190" :rows="5" />
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
import crudGroup from '@/api/group'
import CRUD, { presenter, crud, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import { mapGetters } from 'vuex'
const defaultForm = { id: null, name: null, note: null }
export default {
  components: { pagination, TotalPage },
  mixins: [presenter(), crud(), form(defaultForm)],
  data() {
    return {
      rules: {
        name: [
          { required: true, message: `请填写名称`, trigger: 'blur' }
        ]
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
      if (this.activeButton.show && this.activeButton.action === 'create_group') {
        this.crud.toAdd()
      }
    }
  },
  cruds() {
    return CRUD({ title: '商品分组', url: '/lmp/v2/admin/group', sort: 'createdAt,desc', crudMethod: { ...crudGroup }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '商品分组' }
    ])
    this.init_button()
    this.crud.refresh()
  },
  destroyed() {
    console.log('destroyed')
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
