<template>
  <div :style="{color: color, 'font-size': size}" style="display: inline">
    <div v-if="item.MixedPrice" class="flex price">
      <div v-if="item.points != 0">
        {{ item.points }} <span class="unit">积分</span>
      </div>
      <div v-if="item.points !== 0 && item.cash !== 0" style="margin-left: 5px; margin-right: 5px;"> + </div>
      <div v-if="item.cash !== 0">
        {{ toPrice(item.cash) }} <span class="unit">元</span>
      </div>
      <div v-if="item.points === 0 && item.cash === 0">
        {{ toPrice(item.cash) }} <span class="unit">元</span>
      </div>
    </div>
    <div v-else class="flex price">
      {{ toPrice(item.cash) }} <span class="unit">元</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => { return {} }
    },
    color: {
      type: String,
      default: () => {
        return '#F64348'
      }
    },
    size: {
      type: String,
      default: () => {
        return '16px'
      }
    }
  }
}
</script>

<style scoped>
.flex {
  display: inline-flex;
  align-items: center;
}
</style>
