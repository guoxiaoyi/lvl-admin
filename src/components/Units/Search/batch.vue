<template>
  <el-form ref="filterForm" :inline="true" :model="query" size="small" :show-message="false" class="filter-form-inline">
    <el-form-item label="序号搜索" class="content-full" prop="snText" :rules="[{ required: totalAmount > 10000000, message: '请输入序号', trigger: 'blur' }]">
      <div style="width: 320px;">
        <el-input v-model="query.snText" type="textarea" placeholder="一行输入一个二维码序列号，多个序列号请换行输入 最多99条数据" :rows="5" />
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
      default: 10000000
    }
  },
  data() {
    return {
      rules: {
        snText: [{ required: false, message: '请输入序号', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['activityData'])
  }
}
</script>
