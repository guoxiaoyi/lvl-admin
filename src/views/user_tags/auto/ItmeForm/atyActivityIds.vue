<template>
  <div>
    <el-form-item>
      <el-select
        v-model="form.value"
        size="small"
        clearable
        filterable
        remote
        reserve-keyword
        placeholder="请输入"
        :remote-method="remoteActiveMethod"
        :loading="searchActiveLoading"
      >
        <el-option
          v-for="item in activityList"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import activities from '@/api/activities'
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
      searchActiveLoading: false,
      activityList: []
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
    this.init()
  },
  methods: {
    init() {
      this.searchActiveLoading = true
      activities.list({}).then(({ data }) => {
        this.searchActiveLoading = false
        this.activityList = data.content
      })
    },
    remoteActiveMethod(query) {
      if (query !== '') {
        this.searchActiveLoading = true
        setTimeout(() => {
          activities.list({ search: query.toLowerCase() }).then(({ data }) => {
            this.searchActiveLoading = false
            this.activityList = data.content
          })
        }, 200)
      } else {
        this.init()
      }
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
