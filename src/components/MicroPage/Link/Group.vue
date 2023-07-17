<template>
  <div>
    <div class="table-bordered">
      <el-table v-loading="crud.loading" :data="crud.data">
        <el-table-column label="标题">
          <template slot-scope="scope">
            <el-radio v-model="form.id" :label="scope.row.id" @input="change">
              <router-link :to="{name: 'GroupGrouping', params: {id: scope.row.id}}" target="_blank" class="name">
                {{ scope.row.name }}
              </router-link>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180px" prop="createdAt" />
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <router-link target="_blank" :to="{name: 'GroupGrouping', params: {id: scope.row.id}}">
              查看
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <DialogPagination :size="6" />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import DialogPagination from '@crud/DialogPagination'

export default {
  components: { DialogPagination },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '分组管理', url: '/lmp/v2/admin/group', params: { onSale: true }, size: 10 })
  },
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.crud.refresh()
  },
  methods: {
    change(val) {
      this.form.link_name = this.crud.data.find(item => item.id === val).name
    }
  }
}
</script>

<style lang="scss" scoped>

.table-bordered {
  border: 1px solid #ddd;
  margin-bottom: 10px;
}
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  // display: box;
  -webkit-box-orient: vertical;
  width: 100%;
}

::v-deep {
  .el-radio {
    display: flex;
    width: 100%;
    align-items: center;
  }
}
</style>
