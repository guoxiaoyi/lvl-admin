<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          消息推送
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-info" role="alert">
          <i class="fa fa-question-circle" />
          使用说明: <br>
          1、使用微信公众号模板消息需先绑定认证服务号，并于微信公众号后台开通“模板消息”功能（设置与开发--公众号设置--账号详情--服务类目--添加：工具>信息查询）；<br>
          2、每个认证服务号最多可同时启用25个模板ID（公众号相同的模板ID计为1个）；公众号已添加的模板一旦达到25个，可能无法正常推送消息，此时请商家进入微信公众号后台删除部分不启用的模板。
        </div>
        <el-table v-loading="crud.loading" :data="crud.data">
          <el-table-column label="消息名称" prop="name" />
          <el-table-column label="发送时间点" prop="desc" />
          <el-table-column label="启用">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enable" :disabled="!checkPer(['wechat_menu_manage'])" @change="changeTemplateEnabled(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="preview(scope.row)">预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.preview.show"
      title="预览"
      width="580px"
    >
      <div v-if="modal.preview.show" class="wechat-message-template">
        <p class="title">{{ modal.preview.data.name }}</p>
        <p class="time">{{ modal.preview.data.preview.time }}</p>
        <p v-for="(item, index) in modal.preview.data.preview.content" :key="index" class="content">{{ item }}</p>
        <p class="view-detail">查看详情&gt;</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import wechat_message_templates from '@/api/wechat_message_templates'

export default {
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '消息推送', url: '/lmp/v2/admin/wechat_message_template/list' })
  },
  data() {
    return {
      modal: {
        preview: {
          data: {},
          show: false
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '消息推送' }
    ])
    this.crud.refresh()
  },
  methods: {
    changeTemplateEnabled(data) {
      wechat_message_templates.edit({ code: data.code, enable: data.enable }).then(response => {
        this.$message.success(`${data.enable ? '开启' : '关闭'}成功`)
      })
    },
    preview(data) {
      console.log(data)
      this.modal.preview.show = true
      this.modal.preview.data = data
    }
  }
}
</script>
<style lang="scss" scoped>
.wechat-message-template {
  color: #333;
  .title{
    font-size: 18px;
    color: #333333;
  }
  .time{
    font-size: 16px;
    margin-bottom: 20px;
    color: #999999;
  }
  .view-detail{
    margin-top: 20px;
    color: raba(0, 0, 0, 0.8)
  }
}

</style>
