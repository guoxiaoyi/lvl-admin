<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          未提交导购返利订单
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-heading">
        <el-button type="success" :disabled="ids.length === 0" @click="submit">批量提交</el-button>
      </div>
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" />
            <el-table-column label="订单号/创建时间">
              <template slot-scope="scope">
                <router-link :to="{ name: 'RebateOrderShow', params: { id: scope.row.code }}">{{ scope.row.code }} </router-link><br>
                {{ scope.row.createdAt }}
              </template>
            </el-table-column>
            <el-table-column label="活动">
              <template slot-scope="scope">
                <span v-if="scope.row.activity">
                  {{ scope.row.activity.title }}
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="产品">
              <template slot-scope="scope">
                <router-link v-if="scope.row.productInfo" :to="{ name: 'ProductShow', params: { id: scope.row.productInfo.id }}">
                  {{ scope.row.productInfo.name }}
                </router-link>
                <span v-else> - </span>
              </template>
            </el-table-column>
            <el-table-column label="礼品">
              <template slot-scope="scope">
                {{ scope.row.goods.name }}
              </template>
            </el-table-column>
            <el-table-column label="导购员">
              <template slot-scope="scope">
                {{ scope.row.userName }}
              </template>
            </el-table-column>
            <el-table-column label="渠道">
              <template slot-scope="scope">
                <router-link v-if="scope.row.channel" :to="{ name: 'ChannelShow', params: { id: scope.row.channel.id }}">
                  {{ scope.row.channel.name }}
                </router-link>
                <span v-else> - </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90px">
              <template slot-scope="scope">
                <router-link :to="{ name: 'RebateOrderShow', params: { id: scope.row.code }}">详情</router-link>
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
      :visible.sync="export_data_modal.show"
      title="后台任务"
      width="780px"
    >
      <p class="alert alert-info">
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<router-link :to="{name: 'BackendJobs'}" target="_blank">后台任务管理</router-link>中查看任务完成情况。
      </p>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ export_data_status.stateName }}</span>
        <span>共 {{ export_data_status.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="export_data_status.current" color="#5cb85c" :text-inside="true" :stroke-width="20" text-color="#FFF" />
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import backend_job from '@/api/backend'
import rebate_orders from '@/api/rebate_order'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({
      title: '未提交导购返利订单',
      url: '/lmp/v2/admin/rebate_order/pending',
      sort: ['createdAt,desc']
    })
  },
  data() {
    return {
      ids: [],
      export_data_modal: {
        show: false
      },
      export_data_status: {
        state: ''
      },
      set_interval_id: null
    }
  },
  watch: {
    'export_data_status.state'() {
      if (this.export_data_status.state === 'finished') {
        clearInterval(this.set_interval_id)
      }
    },
    'export_data_modal.show'() {
      if (!this.export_data_modal.show) {
        clearInterval(this.set_interval_id)
        window.location.reload()
      }
    }
  },
  mounted() {
    this.crud.refresh()
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '导购返利订单', path: { name: 'RebateOrderAll' }}, { title: '未提交导购返利订单' }])
  },
  methods: {
    submit() {
      this.export_data_modal.show = true
      this.export_data_status = {
        stateName: null,
        progressMax: 0,
        current: 0,
        state: null,
        fileFileName: null
      }
      rebate_orders.batch_submit({ ids: this.ids.map(item => item.id) }).then(({ data }) => {
        this.export_data_status = data
        this.set_interval_id = setInterval(() => {
          backend_job.show({ id: this.export_data_status.id }).then(response => {
            this.export_data_status.stateName = response.data.stateName
            this.export_data_status.progressMax = response.data.progressMax
            this.export_data_status.current = response.data.current
            this.export_data_status.state = response.data.state
            if (response.data.state === 'finished') {
              this.export_data_status.fileFileName = response.data.fileFileName
            }
          })
        }, 1500)
      })
    },
    handleSelectionChange(data) {
      this.ids = data
    }
  }
}
</script>
