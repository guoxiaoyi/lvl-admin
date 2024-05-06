<template>
  <div>
    <el-form-item v-if="vipFuncEnabled">
      <el-select v-model="form.value" placeholder="请选择">
        <el-option v-for="item in levelList" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import point_store from '@/api/point_store'
import vip_level from '@/api/vip_level'
export default {
  props: {
    value: {
      type: Number,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      form: {
        value: null
      },
      vipFuncEnabled: true,
      levelList: []
    }
  },
  computed: {

  },
  watch: {
    'form.value'(newVal) {
      this.$emit('input', newVal)
    }
  },
  created() {
    this.form.value = this.value
    point_store.functions().then(response => {
      this.vipFuncEnabled = response.data.vipFuncEnabled
      if (this.vipFuncEnabled) {
        vip_level.list().then(response => {
          this.levelList = response.data
        })
      }
    })
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
