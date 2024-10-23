<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          页面表单
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间">
                <custom-date-picker v-model="query.createdAt" @toQuery="crud.toQuery" />
              </el-form-item>
            </div>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <div v-if="checkPer(['activity_update'])" class="panel-heading"><el-button type="success" @click="exportExcel">导出 Excel</el-button></div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="头像">
              <template slot-scope="scope">
                <el-image :src="scope.row.userAvatar" style="width: 30px;" />
              </template>
            </el-table-column>
            <el-table-column label="昵称">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId}}">
                  {{ scope.row.userNickName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="表单信息">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.customFieldValues" :key="index" class="flex">
                  {{ item.customField.label }}：<CustomField :data="item" />
                </div>
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
import micro_page from '@/api/micro_page'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import { mapGetters } from 'vuex'
import { str2Object } from '@/utils/micro_page'
import BackgroundTask from '@/components/BackgroundTask'
import CustomField from '@/components/CustomField'
export default {
  components: {
    pagination,
    BackgroundTask,
    CustomField
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '微页面列表', url: `/lmp/v2/admin/micro_page/${this.parent.$route.params.id}/forms`, sort: ['createdAt,desc'] })
  },
  data() {
    return {
      title: null,
      task: {
        id: null,
        state: false
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  async mounted() {
    await micro_page.show(this.$route.params).then(({ data }) => {
      this.title = str2Object(data.content).title.data.title
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '微页面列表', path: { name: 'MicroPages' }},
      { title: this.title, path: { name: 'MicroPageEdit', params: { id: this.$route.params.id }}},
      { title: '页面表单' }
    ])
    this.crud.refresh()
  },
  methods: {
    exportExcel() {
      if (confirm('确认导出数据？')) {
        micro_page.downloadForm({ ...this.crud.query, id: this.$route.params.id }).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.flex {
  .name {
    min-width: 60px;
    margin-right: 10px;
  }
}

</style>
