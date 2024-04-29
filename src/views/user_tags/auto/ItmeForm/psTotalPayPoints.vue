<template>
  <div>
    <el-form-item>
      <div class="el-custom-input-group">
        <el-form-item prop="min" :rules="min">
          <el-input v-model="form.min" />
        </el-form-item>
        <div class="el-input-group-addon">-</div>
        <el-form-item prop="max" :rules="max">
          <el-input v-model="form.max" />
        </el-form-item>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {
        min: null,
        max: null
      },
      max: {},
      min: {}
    }
  },
  computed: {

  },
  watch: {
    'form.min'(newVal) {
      this.$emit('input', [newVal, Array.isArray(this.value) ? this.value[1] : null])
    },
    'form.max'(newVal) {
      this.$emit('input', [Array.isArray(this.value) ? this.value[0] : null, newVal])
    }
  },
  created() {
    this.form.value = this.value
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-form-item--small.el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
