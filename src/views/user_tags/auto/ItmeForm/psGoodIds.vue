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
        :remote-method="remoteStoreGoodsMethod"
        :loading="searchStoreGoodsLoading"
      >
        <el-option v-for="item in storeGoodsList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import store_goods from '@/api/store_goods.js'
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
      searchStoreGoodsLoading: false,
      storeGoodsList: []
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
      this.searchStoreGoodsLoading = true
      store_goods.index({}).then(({ data }) => {
        this.searchStoreGoodsLoading = false
        this.storeGoodsList = data.content
      })
    },
    remoteStoreGoodsMethod(query) {
      if (query !== '') {
        this.searchStoreGoodsLoading = true
        setTimeout(() => {
          store_goods.index({ blurry: query.toLowerCase() }).then(({ data }) => {
            this.searchStoreGoodsLoading = false
            this.storeGoodsList = data.content
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
