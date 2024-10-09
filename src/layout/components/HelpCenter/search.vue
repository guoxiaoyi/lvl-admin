<template>
  <div class="flex search items-center">
    <i class="fa fa-icon-a-4-zhuye" style="font-size: 20px; margin: 10px;" @click="redirectTo('home')" />
    <el-input
      v-model="blurry"
      placeholder="输入关键词，如：注册会员"
      prefix-icon="el-icon-search"
      clearable
      @keyup.enter.native="search"
    />
    <!-- <el-button type="text" style="margin-left: 5px;" @click="search">搜索</el-button> -->
  </div>
</template>

<script>

export default {
  data() {
    return {
      blurry: null
    }
  },
  methods: {
    search() {
      if (this.blurry) {
        this.$emit('search', this.blurry)
      }
    },
    redirectTo(data) {
      this.blurry = null
      this.$emit('redneTemplate', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  background: #ececec;
  padding-right: 2px;
  ::v-deep {
    .el-input__inner {
      border: none;
      border-radius: 0;
      &:focus {
        box-shadow: none;
      }
    }
  }
}
.fa {
  cursor: pointer;
}

</style>
