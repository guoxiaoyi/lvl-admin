<template>
  <div>
    <div class="panel panel-default">
      <el-table v-loading="crud.loading" :data="crud.data">
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="负责区域" prop="regionScopeText">
          <template slot-scope="scope">
            {{ scope.row.regionScopeText.map(i => i.name).join(',') }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span v-if="weworkContactUser && weworkContactUser.includes(scope.row.userid)">已选择</span>
            <el-button v-else type="text" @click="selectWorker(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  props: {
    weworkContactUser: {
      type: Array,
      default: () => { return [] }
    },
    weworkContactUsers: {
      type: Array,
      default: () => { return [] }
    }
  },
  cruds() {
    return CRUD({ title: '员工列表', url: '/lmp/v2/admin/wework_user', sort: [] })
  },
  methods: {
    selectWorker(data) {
      this.$emit('update:weworkContactUser', [...this.weworkContactUser, data.userid])
      this.$emit('update:weworkContactUsers', [...this.weworkContactUsers])
    }
  }
}
</script>

<style>

</style>
