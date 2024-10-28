<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li class="active"><a href="javascript: void(0)">邀请有礼</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-row>
          <el-col :span="10">3</el-col>
          <el-col :span="14">
            <h4>邀请有礼</h4>
            <h5>裂变获客利器</h5>
            <div>通过给与奖励方式带动客户自发老带新传播，精准拓客同时提高活跃
              <router-link :to="{ name: 'InviteRewardsSetting' }" class="el-button el-button--primary">设置</router-link>
            </div>
            <div>
              <h4>会员增长：裂变发展更多会员，提高会员营销</h4>
              <div class="flex state">
                <div class="flex-item">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      <p class="text-muted">今日新增邀请人数</p>
                      <h4>{{ stats.todayNewInviteCount }}</h4>
                    </div>
                  </div>
                </div>
                <div class="flex-item">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      <p class="text-muted">今日新增会员数</p>
                      <h4>{{ stats.todayNewVipCount }}</h4>
                    </div>
                  </div>
                </div>
                <div class="flex-item">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      <p class="text-muted">累计邀请人数</p>
                      <h4>{{ stats.totalInviteCount }}</h4>
                    </div>
                  </div>
                </div>
                <div class="flex-item">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      <p class="text-muted">累计新增会员数</p>
                      <h4>{{ stats.totalVipCount }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { invite_vip_register_order_summary } from '@/api/stats'
export default {
  data() {
    return {
      stats: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '邀请有礼' }])
    invite_vip_register_order_summary().then(({ data }) => {
      this.stats = data
    })
  }
}
</script>

<style lang="scss" scoped>
.state {
  flex-wrap: wrap;
  .flex-item {
    flex: 0 0 50%;
    padding: 10px;
    .panel {
      margin-bottom: 0;
      border-radius: 5px;
    }
  }
}

</style>
