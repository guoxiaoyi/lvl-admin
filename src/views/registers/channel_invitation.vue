<template>
  <div>
    <TabChannelInvitation />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="搜索" prop="name">
              <el-input v-model="query.name" placeholder="名称" />
            </el-form-item>

            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div class="panel panel-default">
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column label="名称" prop="name" />
            <el-table-column label="渠道类型" prop="channel_type">
              <template slot-scope="scope">
                {{ scope.row.channelTypeName }}
              </template>
            </el-table-column>
            <el-table-column label="所属上级" prop="parentChannel.name" />

            <el-table-column label="用户标签" prop="tagNames">
              <template slot-scope="scope">
                <div v-if="scope.row.tagNames">
                  {{ scope.row.tagNames.join(',') }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="开启注册" prop="enabled">
              <template slot-scope="scope">
                {{ scope.row.enabled ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="actions">
              <template slot-scope="scope">
                <span><el-button type="text" @click="get_qr_code(scope.row)">预览</el-button></span> -
                <span><router-link :to="{name: 'ChannelInvitationEdit', params: {id: scope.row.id}}">编辑</router-link></span> -
                <span><el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.show"
      :title="modal.title"
      width="580px"
    >
      <div v-loading="imageLoading" style="text-align: center;">
        <p>复制链接邀请注册</p>
        <div style="width: 80%; margin: 0 auto; margin-bottom: 10px;">
          <el-input ref="copyUrl" v-model="h5_url" type="textarea" style="opacity: 0;position: absolute;" :rows="20" resize="none" />
          <el-input v-model="h5_url" :disabled="true">
            <el-button slot="append" @click="copyClicked">复制</el-button>
          </el-input>
        </div>
        <el-image :src="qr_code" style="width: 200px; height: 200px" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TabChannelInvitation from '@/components/Tabs/channel_invitation'
import { mapGetters } from 'vuex'
import channel_invitation_register from '@/api/channel_invitation_register'

export default {
  components: {
    pagination,
    TabChannelInvitation
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({
      title: '渠道审核列表',
      url: '/lmp/admin/api/channel_invitation_register',
      sort: 'id,desc',
      query: { registerType: 'channel' },
      crudMethod: { ...channel_invitation_register }
    })
  },
  data() {
    return {
      modal: {
        show: false,
        title: ''
      },
      qr_code: '',
      h5_url: '',
      imageLoading: false
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '注册邀请' }])
    this.crud.refresh()
  },
  methods: {
    get_qr_code(data) {
      this.modal.show = true
      this.modal.title = `${data.name}注册码`
      const scene = `${this.account.store.code};0::${data.id}`
      this.imageLoading = true

      channel_invitation_register.qr_code({
        page: 'pages/sign_up/webview',
        scene: scene,
        env_version: 'release',
        check_path: true
      }).then(response => {
        this.imageLoading = false
        this.qr_code = `data:image/png;base64,${response.data}`
        this.h5_url = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/channel_invitation_registers/${data.id}`
      }).catch(() => {
        this.imageLoading = false
      })
    },
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    }
  }
}
</script>

<style>

</style>
