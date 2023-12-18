<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          操作日志
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="时间" prop="createdAt">
              <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item label="管理员" prop="createdAt">
              <el-select v-model="query.operatorId" clearable>
                <el-option
                  v-for="item in accounts"
                  :key="'account_'+item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="操作时间" prop="createdAt" />
            <el-table-column label="管理员" prop="operatorName" />
            <el-table-column label="操作名称" prop="description" />
            <el-table-column label="IP/地区" prop="ipAndCity" />
            <el-table-column label="操作编号" prop="idCode" />
          </el-table>
        </div>
        <pagination />
      </div>
    </div>

  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import moment from 'moment'
import account from '@/api/account'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '操作日志', url: '/lmp/v2/admin/operation_log' })
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'), moment().subtract(1, 'day').format('YYYY-MM-DD 23:59:59')])
            }
          },
          {
            text: '最近7天',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
            }
          },
          {
            text: '最近30天',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(30, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
            }
          }
        ]
      },
      accounts: []
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '操作日志' }])
    this.crud.refresh()
    account.list().then(response => {
      this.accounts = response.data
    })
  }
}
</script>
