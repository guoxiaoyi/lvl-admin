<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column label="昵称" width="180px">
              <template slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <el-avatar shape="square" :size="40" :src="scope.row.user.avatar" style="margin-right: 10px;" />
                  <router-link :to="{name: 'EmployeesShow', params: {id: scope.row.id}}" style="flex: 1">
                    {{ scope.row.user.nickname }}
                  </router-link>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="user.name" />
            <el-table-column label="手机号" prop="user.phone" />
            <el-table-column label="角色" prop="typeName" />

            <!-- <el-table-column label="卡券核销数">
              <template slot-scope="scope">
                暂无<a :href="'/admin/coupon_verifications?filter%5Bby_user%5D=' + scope.row.user.id">明细 </a>
              </template>
            </el-table-column> -->
            <el-table-column label="添加时间" prop="createdAt" width="200px" />
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <div>
                  <router-link :to="{name: 'EmployeesShow', params: {id: scope.row.id}}">
                    详情
                  </router-link>
                  <span v-if="scope.row.type === 'ChannelWorker' && $route.name === 'ChannelWorker'">
                    -
                    <el-button type="text" @click="setManager(scope.row)">设为管理员</el-button>
                  </span>
                  <span v-if="scope.row.type === 'ChannelWorker'">-</span>
                  <el-button v-if="scope.row.type === 'ChannelWorker'" type="text" @click="crud.doDelete(scope.row)">移除</el-button>
                </div>
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
import tab from '@/components/Tabs/channel_show'

import channels from '@/api/channels'
import employee from '@/api/employee'

export default {
  components: {
    pagination,
    tab
  },
  cruds() {
    return CRUD({ title: '员工列表', url: '/lmp/admin/api/employee', sort: 'id,desc', crudMethod: { ...employee }})
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      channel: { }
    }
  },
  async mounted() {
    await channels.get(this.$route.params).then(response => {
      this.channel = response.data
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '渠道列表', path: { name: 'ChannelSearch' }},
      { title: this.channel.name, path: { name: 'ChannelShow', params: { id: this.$route.params.id }}},
      { title: '员工列表', path: { name: 'ChannelWorker', params: { id: this.$route.params.id }}}
    ])
    this.crud.query.channelId = this.$route.params.id
    this.crud.refresh()
  },
  methods: {
    setManager(data) {
      if (confirm('确定将该员工设为当前渠道管理员吗？')) {
        employee.setManager({ id: data.id }).then(response => {
          this.$message.success('更新成功')
          this.crud.refresh()
        })
      }
    }
  }
}
</script>
