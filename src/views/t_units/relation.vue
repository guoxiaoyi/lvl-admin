<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-heading">套码规格: </div>
      <div class="panel-body">
        <VJstree :data="result" :collapse="true" />
      </div>
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/t_units'
import t_unit from '@/api/t_unit'
import VJstree from 'vue-jstree'
export default {
  components: {
    tab,
    VJstree
  },
  data() {
    return {
      result: []
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯码查询', path: { name: 'TUnitsIndex' }},
      { title: '追溯码详情' }
    ])
    t_unit.relation(this.$route.params.id).then(response => {
      this.result = [{ ...response.data }]
    })
  }
}
</script>
