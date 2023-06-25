<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          自动回复
        </a>
      </li>
    </ul>
    <div class="panel panel-default new-show">
      <div class="panel-body">
        <table v-if="Object.keys(result).length" class="table table-loose table-hover">
          <tr>
            <td> 类型</td>
            <td> {{ result.typeName }}</td>
          </tr>
          <tr>
            <td> 回复活动</td>
            <td>
              <a :href="`/admin/activities/${result.activity.id}`">{{ result.activity.title }}</a>
            </td>
          </tr>
          <tr>
            <td> 消息图片</td>
            <td>
              <img :src="result.pictureUrl" width="160px" class="img-thumbnail">
            </td>
          </tr>
          <tr>
            <td> 发码结束回复</td>
            <td> {{ result.completedMsg }}</td>
          </tr>
          <tr v-if="result.activity.type === 'UnitsActivity'">
            <td> 活动抽奖进度</td>
            <td>
              <el-progress :text-inside="true" :stroke-width="20" :percentage="result.activityPercentage" color="#5cb85c" />
            </td>
          </tr>
          <tr v-if="result.type === 'WxReply::Query'">
            <td> 关键词</td>
            <td> {{ result.queryText }}</td>
          </tr>
          <tr v-else>
            <td>二维码</td>
            <td>
              <img :src="result.qrUrl" width="160px" class="img-thumbnail">
            </td>
          </tr>
        </table>
      </div>
      <div class="panel-footer">
        <el-button type="success" @click="$router.push({ name: 'WxReplyEdit', params: { id: result.id } })">修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import wx_replies from '@/api/wx_replies'

export default {
  data() {
    return {
      result: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '自动回复管理', path: { name: 'WxReplyIndex' }},
      { title: '自动回复' }
    ])
    wx_replies.show(this.$route.params).then(({ data }) => {
      this.result = data
    })
  }
}
</script>

<style>

</style>
