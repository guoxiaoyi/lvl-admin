<template>
  <div>
    <slot name="tab" />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="核销时间">
                <custom-date-picker v-model="query.verificationDate" @toQuery="crud.toQuery" />
                <!-- <el-date-picker
                  v-model="query.verificationDate"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="elPickerOptions()"
                /> -->
              </el-form-item>
            </div>
            <el-form-item label="兑换码">
              <el-input v-model="query.code" placeholder="兑换码" />
            </el-form-item>
            <el-form-item label="用户">
              <el-input v-model="query.blurry" placeholder="昵称/姓名/手机号" />
            </el-form-item>
            <el-form-item label="门店" prop="channelId">
              <el-select
                v-model="query.channelId"
                size="small"
                clearable
                filterable
                placeholder="请输入"
              >
                <el-option
                  v-for="item in channels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <TotalPage v-if="checkPer(['coupon_verify_manage'])">
            <el-button type="success" @click="exportExcel">导出Excel</el-button>
          </TotalPage>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="核销时间" prop="verificationDate" width="170px" />
            <el-table-column label="用户" prop="userName" width="170px">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId }}">
                  {{ scope.row.userName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="券码" prop="code" />
            <el-table-column label="核销方" prop="channel.name">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ChannelShow', params: { id: scope.row.channelId }}">
                  {{ scope.row.channelName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="核销人" prop="verificationUserName" />

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
import TotalPage from '@crud/TotalPage'
import channels from '@/api/channels'
import couponVerificationAudit from '@/api/couponVerificationAudit'
import BackgroundTask from '@/components/BackgroundTask'

export default {
  components: {
    BackgroundTask,
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  props: {
    except: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      searchLoading: false,
      channels: [],
      task: {
        state: false,
        id: null
      },
      delivering_failed_ing: false
    }
  },
  cruds() {
    const id = this.parent.$route.name === 'GoodsVerifiedCoupon' ? this.parent.$route.params.goodsId : this.parent.$route.params.id
    return CRUD({ title: '门店核销记录', url: `/lmp/v2/admin/goods/${id}/verified_coupons` })
  },
  mounted() {
    channels.all().then(response => {
      this.channels = response.data
    })
    this.crud.refresh()
  },
  methods: {
    // remoteMethod(query) {
    //   if (query !== '') {
    //     this.searchLoading = true
    //     setTimeout(() => {
    //       channels.all({ blurry: query.toLowerCase() }).then(response => {
    //         this.searchLoading = false
    //         this.channels = response.data
    //       })
    //     }, 200)
    //   } else {
    //     this.channels = []
    //   }
    // },
    exportExcel() {
      if (confirm('确认导出数据？')) {
        const goodsId = this.$route.name === 'GoodsVerifiedCoupon' ? this.$route.params.goodsId : this.$route.params.id
        couponVerificationAudit.download_for_goods(goodsId, { ...this.crud.query }).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
        })
      }
    }
  }
}
</script>
