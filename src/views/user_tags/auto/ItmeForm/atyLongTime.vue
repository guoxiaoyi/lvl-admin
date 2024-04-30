<template>
  <div>
    <el-form-item>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-select v-model="form.type">
            <el-option v-for="item in timeType" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-col>
        <el-col :span="16">
          <div v-if="form.type === 'day'" class="el-custom-input-group">
            <el-input v-model="form.value" />
            <div class="el-input-group-addon">天</div>
          </div>
          <custom-date-picker v-else v-model="form.value" :picker-options="{shortcuts: []}" />
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, String, Number],
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {
        value: null,
        type: 'day'
      },
      timeType: [
        { key: 'day', label: '最近' },
        { key: 'custom', label: '自定义' }
      ]
    }
  },
  computed: {

  },
  watch: {
    'form.value'(newVal) {
      this.$emit('input', newVal)
    },
    'form.type'(newVal) {
      switch (newVal) {
        case 'day':
          this.form.value = Array.isArray(this.value) ? null : (this.value || null)
          break
        case 'custom':
          this.form.value = Array.isArray(this.value) ? (this.value || []) : []
          break
      }
    }
  },
  created() {
    this.form.value = this.value
    if (Array.isArray(this.value)) {
      this.form.type = 'custom'
    } else {
      this.form.type = 'day'
    }
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
