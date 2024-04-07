<template>
  <div>
    <div v-if="list.length === 0" class="table-empty text-center">
      <img :src="require('@/assets/table_empty.png')" alt="Table empty" :style="'width: ' + imgSize + 'px;'">
      <h4>当前暂无数据</h4>
    </div>
    <slot v-else />
  </div>
</template>

<script>
export default {
  props: {
    imgSize: {
      type: Number,
      default: 371
    },
    list: {
      type: Array,
      default: () => { return [] }
    }
  }
}
</script>
