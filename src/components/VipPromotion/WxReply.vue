<template>
  <div>
    <div class="panel panel-default table-responsive">
      <el-table v-loading="crud.loading" :data="crud.data" highlight-current-row @current-change="selectedHandler">
        <el-table-column label="类型" prop="typeName">
          <template slot-scope="scope">
            <el-radio v-model="selected" :label="scope.row.id">
              {{ scope.row.typeName }}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="活动" prop="activeName">
          <template slot-scope="scope">
            <router-link :to="{ name: 'ActivityShow', params: { activityId: scope.row.activityId } }" target="_blank">
              {{ scope.row.activityName }}
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination />
    <hr>
    <div class="flex items-center justify-content__center">
      <el-button type="success" @click="submit">确认</el-button>
    </div>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/DialogPagination'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '自动回复', url: '/lmp/v2/admin/wx_reply', size: 10 })
  },
  data() {
    return {
      selected: null,
      currentRow: {}
    }
  },
  mounted() {
    if (this.checkPer(['wx_reply_manage'])) {
      this.crud.refresh()
    } else {
      this.$message.error('无权限访问')
    }
  },
  methods: {
    selectedHandler(currentRow, oldCurrentRow) {
      this.selected = currentRow.id
      this.currentRow = currentRow
    },
    submit() {
      this.$emit('save', this.currentRow)
    }
  }
}

</script>
<style lang="scss" scoped>
::v-deep {
  .el-table__body tr.current-row>td {
    background-color: transparent;
  }
}
</style>
