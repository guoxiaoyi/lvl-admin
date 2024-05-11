<template>
  <div class="app-container">
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">、
          <el-form-item label="目标渠道类型">
            {{ channelType }}
          </el-form-item>
          <el-form-item label="选择范围">
            <el-button type="success" @click="region_scope.modal.show = true">选择区域</el-button>
          </el-form-item>
          <el-form-item label="公告标题"></el-form-item>
          <el-form-item label="图文详情"></el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="region_scope.modal.show"
      title="选择业务范围"
      width="600px"
    >
      <el-tree
        ref="tree"
        node-key="id"
        :data="[region]"
        show-checkbox
        :props="defaultProps"
        :default-expanded-keys="['100000']"
        :default-checked-keys="defaultCheckedRegion"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="region_scope.button.status" @click="submit_region_scope">确认</el-button>
        <el-button @click="cancel_region_scope">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import channels from '@/api/channels'
import dict_region from '@/api/dict_region'
import region_api from '@/api/region'
export default {
  data() {
    return {
      form: {},
      rules: {},
      channelType: [],
      region_scope: {
        modal: {
          show: false
        },
        button: {
          status: false
        }
      },
      region: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      defaultCheckedRegion: []
    }
  },
  mounted() {
    channels.type().then(({ data }) => {
      this.channelType = data.filter(t => t.key !== 'Channels::Level0')
    })
    dict_region.tree().then(response => {
      this.region = response.data
    })
  },
  methods: {
    submit_region_scope() {
      this.region_scope.button.status = true
      region_api.names({ code: this.$refs.tree.getCheckedKeys().join(',') }).then(response => {
        // this.result_region = response.data
        console.log(response.data.map(r => r.name))
        console.log(response.data.map(r => r.id))
        this.defaultCheckedRegion = response.data.map(r => r.id)
        this.region_scope.button.status = false
        this.cancel_region_scope()
      }).then(response => {
        this.region_scope.button.status = false
      })
    },
    cancel_region_scope() {
      this.region_scope.button.status = false
      this.region_scope.modal.show = false
    },
  }
}
</script>

<style>

</style>
