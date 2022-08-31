<!--分页-->
<template>
  <div :class="className">
    <i class="fa fa-list" />
    <span v-if="page.total">
      第{{ (page.page - 1)*page.size+1 }} - {{ page.page*page.size > page.total ? page.total : page.page*page.size }}条（共{{ page.total }}条记录）
    </span>
    <span v-else>
      无记录
    </span>
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
