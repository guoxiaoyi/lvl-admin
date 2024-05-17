<template>
  <div class="app-container">
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="目标渠道类型">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="form.pushKinds" @change="handleCheckedChange">
              <el-checkbox v-for="channel in channelType" :key="channel.key" :label="channel.key">{{ channel.value }}</el-checkbox>
            </el-checkbox-group>

          </el-form-item>
          <el-form-item label="选择范围">
            {{ pushRange | names }}
            <br v-if="pushRange.length">
            <el-button type="success" size="medium" @click="region_scope.modal.show = true">选择区域</el-button>
          </el-form-item>
          <el-form-item label="公告标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="图文详情" class="form-item-tinymce">
            <Tinymce v-model="form.content" :height="400" />
          </el-form-item>
          <hr>
          <el-button type="success" @click="submit">保存</el-button>
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
        :data="region.children"
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
import Tinymce from '@/components/Tinymce'
import push_message from '@/api/push_message.js'
export default {
  components: {
    Tinymce
  },
  filters: {
    names(arr) {
      return arr.map(item => item.name).join('、')
    }
  },
  data() {
    return {
      form: {
        pushKinds: [],
        pushRange: [],
        title: null,
        content: null
      },
      pushKinds: [],
      pushRange: [],
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
      defaultCheckedRegion: [],
      checkAll: false,
      isIndeterminate: true
    }
  },
  created() {
    if (this.$route.name === 'ChannelNoticeEdit') {
      push_message.show({ id: this.$route.params.id }).then(({ data }) => {
        this.form = data
      })
    }
  },
  mounted() {
    channels.type().then(({ data }) => {
      this.channelType = data.filter(t => t.key !== 'Channels::Level0')
      this.pushKinds = data.filter(t => t.key !== 'Channels::Level0').map(t => t.key)
    })
    dict_region.tree().then(response => {
      this.region = response.data
    })
  },
  methods: {
    submit_region_scope() {
      this.region_scope.button.status = true
      region_api.names({ code: this.$refs.tree.getCheckedKeys().join(',') }).then(response => {
        this.form.pushRange = response.data.map(r => r.id)
        this.pushRange = response.data
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
    submit() {
      this.$refs.form.validate((valid) => {
        const action = this.$route.name === 'ChannelNoticeEdit' ? 'edit' : 'add'
        push_message[action](this.form).then(({ data }) => {
          this.$message.success('保存成功')
        })
      })
    },
    handleCheckAllChange(val) {
      this.form.pushKinds = val ? JSON.parse(JSON.stringify(this.pushKinds)) : []
      this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.pushKinds.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.pushKinds.length
    }
  }
}
</script>

<style>

</style>
