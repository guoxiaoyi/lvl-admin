<template>
  <div class="flex items-center justify-content__center">
    <div style="width: 80%">
      <el-form :model="form" label-width="80px">
        <el-form-item label="跳转类型">
          <el-select v-model="form.id">
            <el-option v-for="(n, idx) in routerType" :key="idx" :label="n.label" :value="n.label">
              <span style="float: left">{{ n.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ n.hint }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.url" />
          <p class="help-block">请输入跳转小程序的页面路径，例如：pages/index/index</p>
        </el-form-item>
      </el-form>
    </div>
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
      text: null,
      routerType: [
        { label: 'SwitchTab', hint: '跳转到 tabBar 页面' },
        { label: 'ReLaunch', hint: '关闭所有页面，打开某个页面' },
        { label: 'RedirectTo', hint: '关闭当前页面, 跳转到某个页面' },
        { label: 'NavigateTo', hint: '保留当前页面，跳转到某个页面' }
      ]
    }
  },
  watch: {
    'form.url'(newValue) {
      this.form.link_name = newValue
    }
  }
}
</script>
<style lang="scss" scoped>
  .flex {
    height: 200px;
  }
</style>
