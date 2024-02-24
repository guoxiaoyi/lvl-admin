<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          未提交分享达标订单
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
                {{ scope.row.code }} <br>
                {{ scope.row.createdAt }}
              </template>
            </el-table-column>
            <el-table-column label="活动">
              <template slot-scope="scope">
                {{ scope.row.activity.title }}
              </template>
            </el-table-column>
            <el-table-column label="产品">
              <template slot-scope="scope">
                <router-link v-if="scope.row.product" :to="{ name: 'ProductShow', params: { id: scope.row.product.id }}">
                  {{ scope.row.product.name }}
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
                <router-link :to="{ name: 'InvitedOrderShow', params: { id: scope.row.code }}">详情</router-link>
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
import invited_order from '@/api/invited_order'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({
      title: '未提交分享达标订单',
      url: '/lmp/v2/admin/invited_order/pending',
      sort: ['createdAt,desc']
    })
  },
  data() {
    return {
      ids: []
    }
  },
  activated() {
    this.crud.refresh()
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '分享达标订单', path: { name: 'InvitedOrderAll' }}, { title: '未提交分享达标订单' }])
  },
  methods: {
    submit() {
      invited_order.batch_submit({ ids: this.ids.map(item => item.id) }).then(({ data }) => {
        console.log(data)
      })
    },
    handleSelectionChange(data) {
      this.ids = data
    }
  }
}
</script>
