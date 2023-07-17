<!--分页-->
<template>
  <div :class="className">
    <slot />
  </div>
</template>
<script>
import { pagination } from '@crud/crud'
export default {
  mixins: [pagination()],
  props: {
    className: {
      type: String,
      default: 'panel-heading'
    }
  }
}
</script>
