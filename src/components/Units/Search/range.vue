<template>
  <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
    <el-form-item label="号段搜索" class="content-full">
      <div style="width: 420px;">
        <el-col :span="11">
          <el-input v-model="query.snStart" placeholder="起始序号" />
        </el-col>
        <el-col :span="2"><div class="text-center">至</div></el-col>
        <el-col :span="11">
          <el-input v-model="query.snEnd" placeholder="终止序号" />
        </el-col>
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
      <el-form-item label="抽奖状态">
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
export default {
  props: {
    query: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
