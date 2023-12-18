<template>
  <div class="app-container">
    <tab>
      <div slot="action">
        <el-button type="success" :disabled="crud.data.length === 0" @click="allRead">全部标记为已读</el-button>
        <el-button type="danger" :disabled="crud.data.length === 0" @click="clear">清空消息</el-button>
      </div>
    </tab>

    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column label="标题" prop="subject">
              <template slot-scope="scope">
                <router-link :to="{ name: 'NotificationShow', params: { id: scope.row.id } }" class="subject">
                  <b v-if="!scope.row.read"><i class="fa fa-envelope fa-fw" /> {{ scope.row.subject }}</b>
                  <span v-else>{{ scope.row.subject }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="时间" prop="createdAt" />
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'NotificationShow', params: { id: scope.row.id }})">查看</el-button>
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
import tab from '@/components/Tabs/notification.vue'
import notifications from '@/api/notifications'
export default {
  components: {
    tab,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '通知管理', url: '/lmp/v2/admin/notification', crudMethod: { ...notifications }})
  },
  data() {
    return {
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '通知管理' }])
    this.crud.refresh()
  },
  methods: {
    allRead() {
      if (confirm('确定全部标记为已读？')) {
        notifications.mark_all_as_read().then(({ data }) => {
          this.$message.success('正在处理中，稍后刷新页面查看')
          this.crud.refresh()
        })
      }
    },
    clear() {
      if (confirm('确定清空全部消息？')) {
        notifications.empty().then(({ data }) => {
          this.crud.refresh()
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
a.subject {
  color: #333;
}
</style>
