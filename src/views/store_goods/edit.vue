<template>
  <el-tabs type="border-card">
      <el-tab-pane label="商品管理">
      <el-card>
        <div slot="header">
          <el-button size="mini" type="success" :disabled="true">上架</el-button>
          <el-button size="mini" type="success" :disabled="true">下架</el-button>
          <el-button size="mini" type="success" :disabled="true">上架</el-button>
        </div>

      </el-card>
    </el-tab-pane>
    <el-tab-pane label="库存预警">配置管理</el-tab-pane>
  </el-tabs>
</template>
