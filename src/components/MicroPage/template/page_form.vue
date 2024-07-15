<template>
  <div style="padding: 10px 0;">
    <el-form label-width="80px">
      <el-form-item v-for="(item, _index) in result.data.customForm" :key="_index" :label="item.label">
        <el-input />
      </el-form-item>
      <div class="text-center">
        <el-button type="success">提交</el-button>
      </div>
    </el-form>
    <slot name="config" />
    <slot name="functionBtn" />
  </div>
</template>

<script>
export default {
  inject: ['_micro_page_edit_vm'],
  provide() {
    return {
      _micro_page_template_vm: this
    }
  },
  props: {
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    result() {
      return this._micro_page_edit_vm['content'][this.index]
    }
  }
}
</script>

<style>

</style>
