<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          未提交邀请有礼订单
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
                <router-link :to="{ name: 'VipRegisterOrderShow', params: { code: scope.row.code }}">{{ scope.row.code }} </router-link><br>
                {{ scope.row.createdAt }}
              </template>
            </el-table-column>
            <el-table-column label="注册人">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId }}">
                  {{ scope.row.userNickname }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="注册等级" prop="vipRegisterLevelName">
              <template slot-scope="scope">
                {{ scope.row.vipRegisterLevelName || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="注册标签" prop="vipRegisterTagNames">
              <template slot-scope="scope">
                {{ scope.row.vipRegisterTagNames || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="注册时间" prop="createdAt" width="180px" />
            <el-table-column label="礼品">
              <template slot-scope="scope">
                <div class="good-name">
                  <component :is="scope.row.goods.deletedAt ? 'span' : 'router-link'" :to="{name: 'GoodsShow', params: { goodsId: scope.row.goodId }}">{{ scope.row.goods.name }}</component>
                </div>
                <goods-price :detail="scope.row.goods" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link :to="{ name: 'VipRegisterOrderShow', params: { code: scope.row.code }}">详情</router-link>
              </template>
            </el-table-column>
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
import GoodsPrice from '@/components/Goods/Price'
import BackgroundTask from '@/components/BackgroundTask'
import vip_register_order from '@/api/vip_register_order.js'
export default {
  components: {
    GoodsPrice,
    BackgroundTask,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({
      title: '未提交会员注册有礼订单',
      url: '/lmp/v2/admin/vip_register_order/pending',
      sort: ['createdAt,desc']
    })
  },
  data() {
    return {
      ids: [],
      task: {
        state: false,
        id: null
      }
    }
  },
  mounted() {
    this.crud.refresh()
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '会员注册有礼订单', path: { name: 'VipRegisterOrderAll' }}, { title: '未提交会员注册有礼订单' }])
  },
  methods: {
    submit() {
      vip_register_order.batch_submit({ ids: this.ids.map(item => item.id) }).then(({ data }) => {
        this.task.id = data.id
        this.task.state = true
      })
    },
    handleSelectionChange(data) {
      this.ids = data
    }
  }
}
</script>

<style>

</style>
