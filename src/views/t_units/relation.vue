<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-heading">套码规格: </div>
      <div class="panel-body">
        <div v-if="currentSn.children && Array.isArray(currentSn.children) && currentSn.children.length" style="margin-bottom: 20px;">
          <el-button :loading="loading" type="primary" @click="units_unpack">解除关联</el-button>
        </div>
        <VJstree :item="result" />
      </div>
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/t_units'
import t_unit from '@/api/t_unit'
import t_unit_batch_t_units from '@/api/t_unit_batch_t_units'
import VJstree from './tree_item.vue'
function findById(data, targetId) {
  if (data.id === targetId) {
    return data
  }
  if (data.children && Array.isArray(data.children)) {
    for (const child of data.children) {
      const result = findById(child, targetId);
      if (result) {
        return result
      }
    }
  }
  return null
}
export default {
  components: {
    tab,
    VJstree
  },
  data() {
    return {
      result: {},
      loading: false
    }
  },
  computed: {
    currentSn() {
      return findById(this.result, parseInt(this.$route.params.id))
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯码查询', path: { name: 'TUnitsIndex' }},
      { title: '追溯码详情' }
    ])
    t_unit.relation(this.$route.params.id).then(response => {
      this.result = response.data
    })
  },
  methods: {
    units_unpack() {
      if (confirm(`确认解除关联 ${this.currentSn.snText} 吗？`)) {
        this.loading = true
        t_unit_batch_t_units.t_units_unpack({ sn: this.currentSn.snText }).then(() => {
          this.$message.success('解除关联成功')
          this.loading = false
          this.$router.push({ name: 'TUnitShow', params: { id: this.$route.params.id }})
        }).catch(fail => {
          this.loading = false
        })
      }
    }
  }
}
</script>
