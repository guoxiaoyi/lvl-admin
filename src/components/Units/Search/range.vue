<template>
  <el-form ref="filterForm" :inline="true" size="small" :model="query" :show-message="false" class="filter-form-inline">
    <el-form-item label="号段搜索" class="content-full" :required="totalAmount > 10000000">
      <div class="el-custom-input-group">
        <el-form-item prop="snStart" style="margin-right: 0px;" :rules="[{ required: totalAmount > 10000000, message: '请输入起始序号', trigger: 'blur' }]">
          <el-input v-model="query.snStart" placeholder="起始序号" />
        </el-form-item>
        <div class="el-input-group-addon" style="margin-bottom: 7px;">至</div>
        <el-form-item prop="snEnd" :rules="[{ required: totalAmount > 10000000, message: '请输入终止序号', trigger: 'blur' }]">
          <el-input v-model="query.snEnd" placeholder="终止序号" />
        </el-form-item>
      </div>
    </el-form-item>
    <div>
      <el-form-item label="扫码状态">
        <el-select v-model="query.visited" clearable>
          <el-option label="已扫码" value="true" />
          <el-option label="未扫码" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="激活状态">
        <el-select v-model="query.enabled" clearable>
          <el-option label="已激活" value="true" />
          <el-option label="未激活" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="作废状态">
        <el-select v-model="query.deleted" clearable>
          <el-option label="已作废" value="true" />
          <el-option label="正常" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="activityData.type !== 'AntiFakeActivity'" label="抽奖状态">
        <el-select v-model="query.used" clearable>
          <el-option label="已抽奖" value="true" />
          <el-option label="未抽奖" value="false" />
        </el-select>
      </el-form-item>
    </div>
    <slot />
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    query: {
      type: Object,
      default: () => {}
    },
    totalAmount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['activityData'])
  }
}
</script>
<style lang="scss" scoped>
// ::v-deep {
//   .is-error {
//     &+.el-input-group-addon{
//       border-color: #d9534f;
//     }
//   }
// }
</style>
