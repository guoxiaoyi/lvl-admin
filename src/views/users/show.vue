<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li class="active"><a aria-current="page" href="javascript:void(0)">用户详情</a></li>
    </ul>
    <div class="panel panel-default new-show">
      <div class="panel-body table-responsive">
        <table class="table table-loose">
          <tr>
            <td>ID</td>
            <td> {{ detail.id }} </td>
          </tr>
          <tr>
            <td>OpenId</td>
            <td> {{ detail.openid }} </td>
          </tr>
          <tr>
            <td>头像</td>
            <td> <el-image :src="detail.avatar" style="width: 50px" /> </td>
          </tr>
          <tr>
            <td>昵称</td>
            <td> {{ detail.nickname }} </td>
          </tr>
          <tr>
            <td>性别</td>
            <td> {{ detail.genderText }} </td>
          </tr>
          <tr>
            <td>用户标签</td>
            <td> {{ detail.tags.map( t => t.name).join(',') }} </td>
          </tr>
          <tr>
            <td>手机号</td>
            <td> {{ detail.phone }} </td>
          </tr>
          <tr>
            <td>积分余额</td>
            <td> {{ detail.pointsTrans }} </td>
          </tr>
          <tr>
            <td>累计积分</td>
            <td> {{ detail.totalPoints }} </td>
          </tr>
          <tr>
            <td>零钱</td>
            <td> {{ detail.cashBalance }} </td>
          </tr>
          <tr>
            <td>累计金额</td>
            <td> {{ detail.totalCash }} </td>
          </tr>
          <tr>
            <td>活动参与次数</td>
            <td> {{ detail.attendingsCount }} </td>
          </tr>
          <tr>
            <td>兑奖次数</td>
            <td> {{ detail.awardCollectedCount }} </td>
          </tr>
        </table>
      </div>
      <div class="panel-footer">
        <el-button type="success" @click="$router.push({ name: 'UserEdit', params: { ...$route.params }})"> 修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import user from '@/api/user'
export default {
  data() {
    return {
      detail: {
        tags: []
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户管理', path: { name: 'UserIndex' }},
      { title: '用户详情' }
    ])
    user.show(this.$route.params).then(response => {
      this.detail = response.data
    })
  }
}
</script>
