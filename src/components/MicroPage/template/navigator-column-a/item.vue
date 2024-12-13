<template>
  <div :class="customClass">
    <img v-if="item.image_url" :src="item.image_url" :alt="item.title" :title="item.title">
    <span v-else class="no-img" />
  </div>
</template>

<script>
export default {
  props: {
    customClass: {
      type: Array,
      default: () => {
        return ['no-img']
      }
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>

span.no-img {
  display: block;
  width: 100%;
  height: 100%;
  background-color: #e4e4e4;
  margin: 0 auto;
  background-image: url('~@/assets/brand.png');
  box-shadow: 0px 0px 3px 0px rgba(67,67,67,0.24);
  background-size: 40%;
  background-repeat: no-repeat;
  background-position: center center;
}
img {
  border-radius: 5px;
  // box-shadow: 0px 0px 3px 0px rgba(67,67,67,0.24);
  vertical-align: top;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
