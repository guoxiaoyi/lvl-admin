<template>
  <div>
    <el-form-item label="中奖区域">
      <div>{{ text.join(',') }}</div>
      <el-button type="success" @click="show = true">设置中奖区域</el-button>
    </el-form-item>
    <CustomPercentageVue />
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show"
      title="选择中奖区域"
      width="780px"
    >
      <el-tree
        ref="tree"
        node-key="id"
        :data="[region]"
        show-checkbox
        :props="props"
        :default-expanded-keys="['100000']"
        :default-checked-keys="defaultCheckedRegion"
      />
      <div slot="footer" class="text-left">
        <el-button :loading="loading" type="success" @click="save">保存</el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CustomPercentageVue from './CustomPercentage.vue'
import dict_region from '@/api/dict_region'
const defaultForm = {
  regions: []
}
export default {
  inject: ['_award_form'],
  components: {
    CustomPercentageVue
  },
  data() {
    return {
      show: false,
      region: [],
      text: [],
      defaultCheckedRegion: [],
      props: {
        label: 'name',
        children: 'children'
      },
      loading: false
    }
  },
  mounted() {
    if (this._award_form.action === 'add') {
      Object.keys(defaultForm).forEach(k => {
        this._award_form.form[k] = defaultForm[k]
      })
    }
    this.defaultCheckedRegion = this._award_form.form['regions']
    dict_region.tree_duplicate(this.defaultCheckedRegion).then(response => {
      this.text = response.data.map(item => item.name)
    })
    dict_region.tree().then(response => {
      this.region = response.data
    })
  },
  methods: {
    save() {
      this.loading = true
      dict_region.tree_duplicate(this.$refs.tree.getCheckedKeys()).then(response => {
        this.loading = false
        this.show = false
        this.text = response.data.map(item => item.name)
        this.defaultCheckedRegion = response.data.map(r => r.id)
        this._award_form.form.regions = response.data.map(r => r.id)
      }).catch(fail => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog {
    margin-top: 5vh !important;
  }
}
</style>
