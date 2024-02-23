<template>
  <div class="tree-item">
    <div style="cursor: pointer; display: inline-block; padding: 0 6px;" :class="{current: $route.params.id == item.id}" @click="get(item.id)">
      <i class="fa fa-cube" />{{ item.text }} <template v-if="$route.params.id == item.id">(当前码)</template>
    </div>
    <!-- Only render children if item.children is truthy and has length -->
    <div v-if="item.children && item.children.length" class="children">
      <TreeItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
      />
    </div>
  </div>
</template>

<script>
import TreeItem from './tree_item.vue'
export default {
  name: 'TreeItem',
  components: {
    TreeItem
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    get(data) {
      console.log(data)
      this.$router.push({ name: 'TUnitShowRelation', params: { id: data }})
    }
  }
}

</script>
<style lang="scss" scoped>
.tree-item {
  margin-left: 20px;
  font-size: 16px;
}
.fa {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
}
.current {
  background: #beebff;
}
</style>
