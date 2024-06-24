<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          短信明细
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <div class="panel-heading">
            <el-button type="success" @click="exportExcel">导出Excel</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="时间" prop="createdAt" />
            <el-table-column label="说明" prop="nameText" />
            <el-table-column label="收支类型" prop="kindText" />
            <el-table-column label="短信数量(个)" prop="amount" />
            <el-table-column label="短信数量(个)" prop="balance" />
            <el-table-column label="备注" prop="note" />
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import sms_trans from '@/api/sms_trans'

import BackgroundTask from '@/components/BackgroundTask'
export default {
  components: {
    pagination,
    BackgroundTask
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '短信明细', url: '/lmp/v2/admin/sms_tran' })
  },
  data() {
    return {
      // 导出
      task: {
        state: false,
        id: null
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '账户概况', path: { name: 'CashTrans' }},
      { title: '短信明细' }
    ])
    this.crud.refresh()
  },
  methods: {
    exportExcel() {
      if (confirm('确认导出数据？')) {
        sms_trans.download({ ...this.crud.query, typeIn: false }).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
        })
      }
    }
  }
}
</script>
