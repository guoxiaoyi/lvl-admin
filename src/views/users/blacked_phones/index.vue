<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="手机号" class="multiple">
              <el-input v-model="query.text" type="textarea" placeholder="一行输入一个手机号, 多个手机号请换行输入, 最多100条数据" :rows="5" />
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="alert alert-info" role="alert">
          <i class="fa fa-question-circle" /> 添加黑名单手机号后，可通过设置活动，要求填写手机号领奖的方式，预先将加入的手机号用户自动加入黑名单，禁止其领奖。
        </div>
        <div class="panel panel-default table-responsive">
          <div class="panel-heading">
            <el-button type="danger" :disabled="currentSelectData.length === 0" @click="del('select')">删除</el-button>
            <el-button type="danger" @click="del('all')">全部删除</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data" @selection-change="selectAll">
            <el-table-column type="selection" width="38" label="全选本页" />
            <el-table-column label="手机号" prop="phone" />
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="del([scope.row])">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination />
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      title="黑名单手机号"
      width="580px"
    >
      <el-form ref="form" :rules="rules" :model="form" size="small" label-width="80px">

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" />
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
import tab from '@/components/Tabs/user_blacked.vue'
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import users from '@/api/user'
import blacked_phone from '@/api/blacked_phone'
import { mapGetters } from 'vuex'

const defaultForm = {
  phone: null
}

export default {
  components: {
    tab,
    pagination
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  data() {
    return {
      currentSelectData: [],
      rules: {
        phone: [
          { required: true, message: `不能为空`, trigger: 'blur' }
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
      if (this.activeButton.show && this.activeButton.action === 'add_blacked_phone') {
        this.crud.toAdd()
      }
    }
  },
  cruds() {
    return CRUD({ title: '黑名单', url: '/lmp/v2/admin/blocked_phone', crudMethod: { ...blacked_phone }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '黑名单' }
    ])
    this.crud.refresh()
  },
  methods: {
    selectAll(val) {
      this.currentSelectData = val
    },
    del(type) {
      const data = { 'select': this.currentSelectData, 'all': [] }[type] || type
      const t = type === 'all' ? `确定删除全部黑名单手机号？共 ${this.crud.page.total} 条` : '确认删除吗?'
      if (confirm(t)) {
        if (type !== 'all') {
          users.del_for_blacked(data.map(u => u.id)).then(response => {
            this.$message.success('删除成功')
            this.crud.refresh()
          })
        } else {
          const phones = {}
          if (this.crud.query.text) {
            phones.text = this.crud.query.text
          } else {
            phones.text = ''
          }
          users.del_for_blacked_all(phones).then(response => {
            this.$message.success('删除成功')
            this.crud.refresh()
          })
        }
      }
    },
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
<style lang="scss" scoped>
::v-deep {
  .multiple {
    width: 500px;
    .el-form-item__content {
      width: 400px;
    }
  }
}
</style>
