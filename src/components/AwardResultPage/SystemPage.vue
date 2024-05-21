<template>
  <div class="table-bordered">
    <el-table :data="datas" :show-header="false">
      <el-table-column label="标题">
        <template slot-scope="scope">
          <el-radio v-model="form.id" :label="scope.row.name" @input="change">
            <div class="flex items-center">
              {{ scope.row.text }}
            </div>
          </el-radio>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      datas: [
        { text: '个人中心', name: 'UserIndex' },
        { text: '继续扫一扫', name: 'goScan' },
        { text: '活动记录', name: 'AttendingIndex' }
      ]
    }
  },
  methods: {
    change(val) {
      this.form.link_name = this.datas.find(item => item.name === val).text
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
