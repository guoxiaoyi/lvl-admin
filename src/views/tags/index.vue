<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li class="active"><a aria-current="page" href="javascript:void(0)">活动标签管理</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="标签名称" prop="name" />
            <el-table-column label="数量" prop="num" />
            <el-table-column label="更新时间" prop="updatedAt" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="crud.toEdit(scope.row)">修改</el-button>
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
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="580px"
    >
      <el-form ref="form" :rules="rules" :model="form" size="small" label-width="80px">
        <el-form-item label="标签名称" prop="name">
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
const defaultForm = {
  name: null,
  type: 'ActivityTag'
}
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import tags from '@/api/tag'
import { mapGetters } from 'vuex'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '标签', url: '/lmp/v2/admin/tag', query: { type: 'ActivityTag' }, crudMethod: { ...tags }, sort: ['createdAt,desc'] })
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
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
    activeButton() {
      if (this.activeButton.show && this.activeButton.action === 'create_activity_tags') {
        this.crud.toAdd()
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动标签管理' }
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
