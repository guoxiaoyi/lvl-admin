<template>
  <div class="app-container">
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="核销时间" prop="createdAt" width="170px" />
            <el-table-column label="卡券名称" prop="code">
              <template slot-scope="scope">
                <router-link :to="{ name: 'GoodsShow', params: { goodsId: scope.row.goodId}}">
                  {{ scope.row.goodName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="券码" prop="couponCode" />
            <el-table-column label="用户昵称">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId}}">
                  {{ scope.row.userName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="核销方" />
            <el-table-column label="核销人" />
            <el-table-column label="销售方" />
            <el-table-column label="销售人" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'CouponsShow', params: { id: scope.row.couponId }})">详情</el-button>
              </template>
            </el-table-column>
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
import channels from '@/api/channels'
import backend_job from '@/api/backend'
import couponVerificationAudit from '@/api/couponVerificationAudit'
import { downloadUrlFile } from '@/utils'

export default {
  components: {
    pagination
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
      ids: [],
      searchLoading: false,
      channels: [],
      // 导出
      export_data_modal: {
        show: false
      },
      export_data_status: {
        state: ''
      },
      set_interval_id: null,
      delivering_failed_ing: false
    }
  },
  watch: {
    'export_data_status.state'() {
      if (this.export_data_status.state === 'finished') {
        clearInterval(this.set_interval_id)
      }
    }
  },
  cruds() {
    return CRUD({ title: '卡券核销记录', url: '/lmp/v2/admin/coupon_verification/detail_all' })
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '卡券核销记录' }])
    this.crud.refresh()
  }
}
</script>

<style>

</style>
