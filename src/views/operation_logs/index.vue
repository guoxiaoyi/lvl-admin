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
            <div class="date-picker">
              <el-form-item label="时间" prop="createdAt">
                <custom-date-picker v-model="query.createdAt" @toQuery="crud.toQuery" />
              </el-form-item>
            </div>
            <template v-if="account.isInspector">
              <el-form-item label="controller">
                <el-input v-model="query.controllerPath" clearable />
              </el-form-item>
              <el-form-item label="action">
                <el-input v-model="query.actionName" clearable />
              </el-form-item>
              <el-form-item label="方法类型">
                <el-select v-model="query.method">
                  <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </template>
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
            <el-table-column v-if="account.isInspector" label="详情" prop="action" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="showDetail(scope.row)">详情</el-button>
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
      :visible.sync="log.show"
      title="详情"
      width="780px"
    >
      <VueJsonPretty v-if="log.data" :data="log.data" />
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import moment from 'moment'
import account from '@/api/account'
import operationLogApi from '@/api/operation_log.js'
import { mapGetters } from 'vuex'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

export default {
  components: {
    VueJsonPretty,
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
      log: {
        show: false,
        data: {}
      },
      accounts: []
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {
    'log.show'(newValue, oldValue) {
      if (!newValue) {
        this.log.data = {}
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '操作日志' }])
    this.crud.refresh()
    account.list().then(response => {
      this.accounts = response.data
    })
  },
  methods: {
    showDetail(data) {
      this.log.show = true
      operationLogApi.get(data).then(({ data }) => {
        try {
          this.log.data = JSON.parse(data)
        } catch (e) {
          this.log.data = {}
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .vjs-key {
    white-space: nowrap;
  }
}
</style>